// Seleciona o elemento com a classe "result" (visor da calculadora)
const result = document.querySelector(".result");

// Seleciona todos os botões dentro do elemento com a classe "buttons"
const buttons = document.querySelectorAll(".buttons button");

// Variáveis para armazenar o número atual, primeiro operando, operador e flag de reinício
let currentNumber = "";
let firstOperand = null;
let operator = null;
let restart = false;

// Função para atualizar o visor com o resultado
function updateResult(originClear = false) {
    // Se originClear for verdadeiro, exibe 0, senão exibe o número atual substituindo "." por ","
    result.innerText = originClear ? 0 : currentNumber.replace(".", ",");
}

// Função para adicionar dígitos ao número atual
function addDigit(digit) {
    // Verifica se o dígito é "," e se o número já contém uma vírgula ou está vazio
    if (digit === "," && (currentNumber.includes(",") || !currentNumber))
        return;

    // Se a flag de reinício estiver ativada, substitui o número atual pelo dígito e desativa a flag
    if (restart) {
        currentNumber = digit;
        restart = false;
    } else {
        // Se não estiver reiniciando, adiciona o dígito ao número atual
        currentNumber += digit;
    }

    // Atualiza o visor com o número atual
    updateResult();
}

// Função para limpar a calculadora
function calculator() {
    // Reseta todas as variáveis e reinicia o visor
    currentNumber = "";
    firstOperand = null;
    operator = null;
    restart = false; // Resetar a flag de reinício
    updateResult(true);
}

// Função para definir o operador da calculadora
function setOperator(newOperator) {
    // Verifica se há um número atual
    if (currentNumber) {
        // Se houver um primeiro operando e um operador já definido, realiza o cálculo da operação anterior
        if (firstOperand !== null && operator !== null) {
            calculate(); // Calcular o resultado da operação anterior
        } else {
            // Se não houver operação anterior, converte o número atual em ponto flutuante e define como primeiro operando
            firstOperand = parseFloat(currentNumber.replace(",", "."));
        }
        restart = true; // Ativa a flag de reinício
    }

    // Define o novo operador
    operator = newOperator;
}

// Função para realizar o cálculo com o operador atual
function calculate() {
    // Verifica se não há operador ou se o número atual está vazio
    if (operator == null || currentNumber === "") return;

    // Converte o número atual em ponto flutuante
    let secondOperand = parseFloat(currentNumber.replace(",", "."));
    let resultValue;

    // Realiza o cálculo com base no operador atual
    switch (operator) {
        case "+":
            resultValue = firstOperand + secondOperand;
            break;
        case "-":
            resultValue = firstOperand - secondOperand;
            break;
        case "×":
            resultValue = firstOperand * secondOperand;
            break;
        case "÷":
            resultValue = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    // Formata o resultado para exibir no máximo 5 casas decimais
    if (resultValue.toString().split(".")[1]?.length > 5) {
        currentNumber = parseFloat(resultValue.toFixed(5)).toString();
    } else {
        currentNumber = resultValue.toString();
    }

    // Reseta as variáveis de operador e primeiro operando
    operator = null;
    firstOperand = resultValue;
    restart = false; // Remover a reinicialização aqui para permitir cálculos consecutivos
    updateResult();
}

// Função para calcular a porcentagem do número atual
function setPercentage() {
    // Calcula a porcentagem do número atual
    let result = parseFloat(currentNumber) / 100;

    // Se o operador for "+" ou "-", multiplica pela porcentagem pelo primeiro operando (ou 1, se for nulo)
    if (["+", "-"].includes(operator)) {
        result = result * (firstOperand || 1);
    }

    // Formata o resultado para exibir no máximo 5 casas decimais
    if (result.toString().split(".")[1]?.length > 5) {
        result = result.toFixed(5).toString();
    }

    // Atualiza o número atual com o resultado da porcentagem
    currentNumber = result.toString();
    updateResult();
}

// Adiciona um ouvinte de evento de clique a cada botão
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        // Obtém o texto do botão clicado
        const buttonText = button.innerText;

        // Verifica se o texto do botão é um número ou vírgula
        if (/^[0-9,]+$/.test(buttonText)) {
            addDigit(buttonText);
        } else if (["+", "-", "×", "÷"].includes(buttonText)) {
            // Se o texto do botão for um operador, define o operador
            setOperator(buttonText);
        } else if (buttonText === "=") {
            // Se o texto do botão for "=", realiza o cálculo
            calculate();
        } else if (buttonText === "C") {
            // Se o texto do botão for "C", limpa a calculadora
            calculator(); // Corrigido para chamar a função `calculator()` em vez de `clearCalculator()`
        } else if (buttonText === "±") {
            // Se o texto do botão for "±", inverte o sinal do número atual
            currentNumber = (
                parseFloat(currentNumber || firstOperand) * -1
            ).toString();
            updateResult();
        } else if (buttonText === "%") {
            // Se o texto do botão for "%", calcula a porcentagem.
            setPercentage();
        }
    });
});
