import { render, screen, act } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import CandidatarPage from "./page";

/// <reference types="@testing-library/jest-dom" />

const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("../../components/ui/InputField", () => {
  return jest.fn(({ label, name, value, onChange, placeholder, ...props }) => (
    <div data-testid={`input-field-${name}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  ));
});

type PromiseResolver = (value: {
  ok: boolean;
  json: () => Promise<any>;
}) => void;

describe("CandidatarPage (Teste de Componente com RTL)", () => {
  const setup = () => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:3001";

    mockFetch.mockClear();
    render(<CandidatarPage />);
    const user = userEvent.setup();
    return { user };
  };

  const preencherFormulario = async (user: UserEvent) => {
    await user.type(screen.getByLabelText(/Nome Completo/i), "Bruce Wayne");
    await user.type(screen.getByLabelText(/E-mail/i), "bruce@waynecorp.com");
    await user.type(screen.getByLabelText(/Empresa/i), "Wayne Enterprises");

    const motivoTextArea = screen.getByLabelText(
      /Por que você quer participar?/i
    );
    await user.type(motivoTextArea, "Para provar a cobertura de testes.");
  };

  it("1. Deve preencher e submeter o formulário com sucesso, exibindo a mensagem de aprovação", async () => {
    const { user } = setup();

    let resolvePromise: PromiseResolver; 
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve as PromiseResolver;
        })
    );

    await preencherFormulario(user);
    const submitButton = screen.getByRole("button", {
      name: /Enviar Candidatura/i,
    });
    await user.click(submitButton);

    expect(
      screen.getByRole("button", { name: /Enviando Solicitação.../i })
    ).toBeDisabled(); 

    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve({ id: 1, status: "PENDENTE" }),
      });
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/✅ Candidatura enviada com sucesso!/i)
    ).toBeInTheDocument(); 

    expect(screen.getByLabelText(/Nome Completo/i)).toHaveValue(""); 
  });

  it("2. Deve mostrar uma mensagem de erro se a requisição de rede falhar", async () => {
    const { user } = setup();

    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    await preencherFormulario(user);
    const submitButton = screen.getByRole("button", {
      name: /Enviar Candidatura/i,
    });
    await user.click(submitButton);

    const errorMessage = await screen.findByText(
      /❌ Erro de conexão com o servidor/i
    );
    expect(errorMessage).toBeInTheDocument(); 
  });
});