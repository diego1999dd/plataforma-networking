import { render, screen, act } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import CandidatarPage from "./page";

// 1. RESOLUÇÃO DOS ERROS DE MATCHER (toBeInTheDocument, etc.)
// Informa ao TypeScript para incluir os tipos Jest/RTL
/// <reference types="@testing-library/jest-dom" />

// MOCK GLOBAL: Simula a função de rede (fetch)
const mockFetch = jest.fn();
global.fetch = mockFetch;

// MOCK DE NAVEGAÇÃO
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// MOCK DO INPUTFIELD
jest.mock("../../components/ui/InputField", () => {
  // eslint-disable-next-line react/display-name
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

// 2. RESOLUÇÃO DOS ERROS 'implicitly has an any type'
// Tipagem explícita para o resolvedor da Promise
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

  // TIPAGEM CORRIGIDA: user tipado como UserEvent
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

    // 1. Mockar Resposta da API de forma controlada
    let resolvePromise: PromiseResolver; // TIPAGEM CORRIGIDA (resolvePromise)
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

    // 2. Verificar o estado de carregamento do botão (UX)
    // O componente agora está "pausado" no estado de carregamento, permitindo a verificação
    expect(
      screen.getByRole("button", { name: /Enviando Solicitação.../i })
    ).toBeDisabled(); // CORRIGIDO o erro do matcher na linha 83/84

    // 3. Agora, resolvemos a Promise manualmente e verificamos o estado final
    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve({ id: 1, status: "PENDENTE" }),
      });
    });

    // 4. Verificar se a chamada fetch ocorreu e se a mensagem final é de sucesso
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/✅ Candidatura enviada com sucesso!/i)
    ).toBeInTheDocument(); // CORRIGIDO o erro do matcher na linha 97

    // 5. Verificar se os campos do formulário foram limpos
    expect(screen.getByLabelText(/Nome Completo/i)).toHaveValue(""); // CORRIGIDO o erro do matcher na linha 101
  });

  it("2. Deve mostrar uma mensagem de erro se a requisição de rede falhar", async () => {
    const { user } = setup();

    // Mockar Falha de Rede (Rejeição da Promise)
    mockFetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    // TIPAGEM CORRIGIDA para o 'user'
    await preencherFormulario(user);
    const submitButton = screen.getByRole("button", {
      name: /Enviar Candidatura/i,
    });
    await user.click(submitButton);

    // Esperar a mensagem de erro de conexão
    const errorMessage = await screen.findByText(
      /❌ Erro de conexão com o servidor/i
    );
    expect(errorMessage).toBeInTheDocument(); // CORRIGIDO o erro do matcher na linha 119
  });
});
