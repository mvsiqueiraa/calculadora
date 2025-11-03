# 🚀 Calculadora Científica IEG

**Projeto final das disciplinas de Programação II e Cálculo I do Instituto de Engenharia e Geociências (IEG) da Universidade Federal do Oeste do Pará (UFOPA).**

Uma aplicação web interativa que oferece funcionalidades avançadas de cálculo, visualização gráfica de funções e explicações passo a passo dos procedimentos de resolução.

![Imagem da Calculadora IEG](<img width="1755" height="2369" alt="image" src="https://github.com/user-attachments/assets/e088ff22-258f-4cad-846d-3e1a52120751" />
)

---

## 🧭 Sumário

* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Como Executar](#-como-executar-o-projeto)
* [Guia de Uso (Manual)](#-guia-de-uso-manual)
* [Autores](#-autores)

---

## ✨ Funcionalidades

A calculadora suporta uma vasta gama de operações, divididas em categorias:

* **Operações Básicas:** Adição, subtração, multiplicação, divisão e parênteses.
* **Funções Científicas:**
    * Trigonométricas (sin, cos, tan) e suas inversas (arcsin, arccos, arctan).
    * Logaritmos (ln) e Exponencial ($e^x$).
    * Potências ($x^2$, $x^3$, $x^y$) e Raízes ($\sqrt{x}$, $\sqrt[n]{x}$).
    * Fatorial ($n!$) e Inversa ($1/x$).
* **Cálculo Avançado:**
    * Cálculo de **Derivadas** simbólicas ($\frac{d}{dx}$).
    * Cálculo de **Limites** por aproximação numérica.
    * Operações com **Frações** ($\frac{a}{b}$).
    * Logaritmo com **base personalizada** ($\log_b(x)$).
* **Recursos de Interface:**
    * Plotagem de **Gráficos de Funções** $f(x)$.
    * **Explicação Passo a Passo** dos cálculos.
    * Alternância entre modos **Radianos/Graus**.
    * **Histórico** de cálculos persistente.
    * Alternância entre **Tema Claro/Escuro**.
    * Design responsivo e suporte a teclado físico.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **HTML5:** Estruturação semântica da página.
* **CSS3:** Estilização, responsividade e temas (claro/escuro).
* **JavaScript (ES6+):** Lógica principal, manipulação do DOM e gerenciamento de estado.
* **Math.js:** Biblioteca para parsing e avaliação de expressões matemáticas complexas, incluindo derivadas.
* **Chart.js:** Biblioteca para a plotagem interativa dos gráficos de funções.

---

## 🏁 Como Executar o Projeto

Como este é um projeto *front-end* puro, não é necessário um servidor ou processo de *build*.

1.  Clone este repositório:
    ```bash
    git clone https://github.com/mvsiqueiraa/calculadora
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd calculadora
    ```
3.  Abra o arquivo `index.html` diretamente no seu navegador de preferência.

E pronto! A calculadora estará funcional.

---

## 📖 Guia de Uso (Manual)

### 1. Cálculos Básicos e Científicos

* **Expressões Simples:** Digite a expressão na tela (ex: `5 * (10 + 3)`) e pressione **`=`**.
* **Funções (sin, cos, ln, etc.):** Pressione o botão da função (ex: `sin(`), digite o argumento e feche os parênteses (ex: `sin(90)`).
* **Modo de Ângulo:** Use os botões **`Rad`** (Radianos) e **`Deg`** (Graus) no topo para alternar o modo de cálculo das funções trigonométricas. O modo ativo fica destacado.

### 2. Funções Avançadas (Com Prompt)

Funções como Derivada, Limite, Fatorial e Log com base usam uma caixa de diálogo (`prompt`) para solicitar as entradas.

* **Derivada (`d/dx`):**
    1.  Pressione **`d/dx`**.
    2.  Na caixa de diálogo, digite a função em termos de `x` (ex: `x^2 + 2x`).
    3.  A derivada simbólica (`2 * x + 2`) aparecerá no display.
* **Limite (`lim`):**
    1.  Pressione **`lim`**.
    2.  Digite a função (ex: `(x^2 - 1)/(x - 1)`).
    3.  Digite o ponto para onde `x` tende (ex: `1`).
    4.  O resultado (`2`) aparecerá no display.
* **Outras Funções (`n!`, `ⁿ√`, `log(b,x)`, `a/b`):**
    * O funcionamento é similar. Pressione o botão e siga as instruções das caixas de diálogo que aparecerão.

### 3. Plotagem de Gráfico

1.  Digite uma função válida em termos de `x` **diretamente no display** (ex: `x^3 - x^2`).
2.  Desça até a seção "Gráfico da Função".
3.  Clique no botão **`Plotar f(x)`**.
4.  O gráfico será renderizado na tela.

### 4. Recursos da Interface

* **Como Resolver:** Esta área é atualizada automaticamente após a maioria dos cálculos, mostrando o passo a passo ou o resultado detalhado (como em derivadas e limites).
* **Histórico (`Hist`):** Mostra um alerta com os últimos 50 cálculos.
* **Tema (`Tema`):** Alterna entre os modos claro e escuro.

---

## 👨‍💻 Autores

| Nome | Curso |
| :---: | :---: |
| **Marcos Siqueira** | Sistemas de Informação |
| **Matheus** | Ciência da Computação |

---

> Projeto desenvolvido para fins acadêmicos na UFOPA, Santarém-PA.
