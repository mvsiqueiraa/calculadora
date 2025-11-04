// Calculadora científica
class Calculadora {
  constructor() {
    this.display = document.getElementById('display');
    this.passos = document.getElementById('passos');
    this.expressaoAtual = '0';
    this.limparAoDigitar = false;
    this.historico = JSON.parse(localStorage.getItem('calc_historico') || '[]');
    this.modoAngulo = 'deg'; // 'deg' ou 'rad'

    this.registrarEventos();
    this.atualizarDisplay();
    this.atualizarBotoesRadDeg();
  }

  registrarEventos() {
    // Cliques em botões numéricos e operadores
    document.querySelector('.botoes')
      .addEventListener('click', e => this.tratarClique(e.target));
    document.querySelector('.botoes-cientificos')
      .addEventListener('click', e => this.tratarClique(e.target));
    document.querySelector('.botoes-rad-deg')
      .addEventListener('click', e => this.tratarClique(e.target));

    // Teclado físico
    window.addEventListener('keydown', e => {
      if (/^[0-9]$/.test(e.key)) this.adicionarNumero(e.key);
      if (['+', '-', '/', '*', '(', ')', '.', '^'].includes(e.key)) this.adicionarOperador(e.key);
      if (e.key === 'Enter' || e.key === '=') this.calcular();
      if (e.key === 'Backspace') this.apagarUltimo();
    });

    // Botão do gráfico
    document.getElementById('btn-grafico')
      .addEventListener('click', () => this.plotarGrafico());
  }

  tratarClique(btn) {
    if (!btn || btn.tagName !== 'BUTTON') return;
    const t = btn.dataset.type, v = btn.dataset.value, id = btn.id;

    if (t === 'numero') this.adicionarNumero(btn.innerText);
    else if (t === 'operador') this.adicionarOperador(v || btn.innerText);
    else if (t === 'func') this.adicionarFuncao(v);
    else if (t === 'const') v === 'pi' ? this.adicionarPi() : this.adicionarNumero(v);
    else if (t === 'acao') {
      if (id === 'btn-igual') this.calcular();
      else if (id === 'btn-limpar-tudo') this.limparTudo();
      else if (id === 'btn-backspace') this.apagarUltimo();
      else if (id === 'btn-derivada') this.calcularDerivada();
      else if (id === 'btn-limite') this.calcularLimite();
      else if (id === 'btn-historico') alert(JSON.stringify(this.historico, null, 2));
      else if (id === 'btn-toggle-theme') document.body.classList.toggle('dark');
      else if (id === 'btn-quadrado') this.adicionarOperador('^2');
      else if (id === 'btn-raiz') this.adicionarFuncao('sqrt(');
      else if (id === 'btn-cubo') this.adicionarOperador('^3');
      else if (id === 'btn-inversa') this.calcularInversa();
      else if (id === 'btn-raiz-n') this.calcularRaizN();
      else if (id === 'btn-fatorial') this.calcularFatorial();
      else if (id === 'btn-log') this.calcularLogaritmo();
      else if (id === 'btn-operacoes-fracoes') this.calcularOperacoesFracoes();
      else if (id === 'btn-rad' || id === 'btn-deg') this.alternarModo(id);

    }
  }

  // Manipulação de expressão
  adicionarNumero(n) {
    if (this.limparAoDigitar || this.expressaoAtual === '0') {
      this.expressaoAtual = n;
      this.limparAoDigitar = false;
    } else this.expressaoAtual += n;
    this.atualizarDisplay();
  }

  adicionarOperador(op) {
    if (this.limparAoDigitar) this.limparAoDigitar = false;
    const last = this.expressaoAtual.slice(-1);
    if (this.expressaoAtual === '0' && op !== '-') return;
    if ('+-*/^'.includes(last) && '+-*/^'.includes(op))
      this.expressaoAtual = this.expressaoAtual.slice(0, -1) + op;
    else this.expressaoAtual += op;
    this.atualizarDisplay();
  }

  adicionarFuncao(fn) {
    this.expressaoAtual = (this.expressaoAtual === '0' || this.limparAoDigitar)
      ? fn : this.expressaoAtual + fn;
    this.limparAoDigitar = false;
    this.atualizarDisplay();
  }

  adicionarPi() {
    this.expressaoAtual = (this.expressaoAtual === '0' || this.limparAoDigitar)
      ? 'pi' : this.expressaoAtual + 'pi';
    this.limparAoDigitar = false;
    this.atualizarDisplay();
  }

  apagarUltimo() {
    this.expressaoAtual = this.expressaoAtual.length <= 1
      ? '0' : this.expressaoAtual.slice(0, -1);
    this.atualizarDisplay();
  }

  limparTudo() {
    this.expressaoAtual = '0';
    this.passos.innerHTML = '';
    this.atualizarDisplay();
  }

  // Cálculos
  sanitizar(expr) {
    return String(expr)
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/\s+/g, '');
  }

  calcular() {
    const expr = this.sanitizar(this.expressaoAtual);
    try {
      const simplificado = math.simplify(expr).toString();

      // Criar contexto personalizado com todas as funções trigonométricas
      const contexto = {
        sin: this.sinComModo.bind(this),
        cos: this.cosComModo.bind(this),
        tan: this.tanComModo.bind(this),
        asin: this.asinComModo.bind(this),
        acos: this.acosComModo.bind(this),
        atan: this.atanComModo.bind(this)
      };

      const resultado = math.evaluate(expr, contexto);
      const texto = Number(resultado).toLocaleString('en-US', { maximumFractionDigits: 3 });

      this.registrarHistorico(expr, texto);
      this.passos.innerHTML =
        `<pre><b>Passo a Passo:</b>
Expressão original: ${this.expressaoAtual}
Resultado final: ${texto}</pre>`;

      this.expressaoAtual = String(texto);
    } catch (err) {
      console.error(err);
      this.expressaoAtual = 'Erro';
      this.passos.innerHTML = `<pre>Erro: verifique a sintaxe da expressão.</pre>`;
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

// Função que calcula a derivada
  calcularDerivada() {
    const func = prompt("Função para derivar (ex: x^2 + 2x):");
    if (!func) return;
    try {
      const deriv = math.derivative(func, 'x').toString();
      this.passos.innerHTML =
        `<pre><b>Derivada:</b>
f(x) = ${func}
f'(x) = ${deriv}</pre>`;
      this.expressaoAtual = deriv;
    } catch {
      this.passos.innerHTML = `<pre>Erro na derivada. Confira a função.</pre>`;
      this.expressaoAtual = 'Erro';
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

// Função que calcula o limite
  calcularLimite() {
    const func = prompt("Função (ex: (x^2 - 1)/(x - 1)):");
    if (!func) return;
    const ponto = prompt("Calcular limite quando x → ?");
    if (!ponto) return;

    try {
      const x0 = parseFloat(ponto), h = 1e-6;
      const vDir = math.evaluate(func, { x: x0 + h });
      const vEsq = math.evaluate(func, { x: x0 - h });
      const resultado = (vDir + vEsq) / 2;
      this.passos.innerHTML =
        `<pre><b>Limite:</b>
Função: ${func}
x → ${x0}
Lado esquerdo: ${vEsq}
Lado direito: ${vDir}
Resultado: ${resultado}</pre>`;
      this.expressaoAtual = resultado.toString();
    } catch {
      this.passos.innerHTML = `<pre>Erro ao calcular limite.</pre>`;
      this.expressaoAtual = 'Erro';
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

// Calcula a função inversa (1/x)
  calcularInversa() {
    const valorAtual = parseFloat(this.expressaoAtual);
    if (!isNaN(valorAtual) && valorAtual !== 0) {
      const resultado = 1 / valorAtual;
      this.registrarHistorico(`1/${valorAtual}`, resultado.toString());
      this.passos.innerHTML =
        `<pre><b>Função Inversa:</b>
Valor original: ${valorAtual}
1/x = 1/${valorAtual}
Resultado: ${resultado}</pre>`;
      this.expressaoAtual = resultado.toString();
    } else {
      this.expressaoAtual = 'Erro';
      this.passos.innerHTML = `<pre>Erro: Divisão por zero não permitida.</pre>`;
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

  calcularRaizN() {
    const indice = prompt("Digite o índice da raiz (ex: 3 para raiz cúbica):");
    if (!indice) return;
    
    const numero = prompt("Digite o número:");
    if (!numero) return;

    try {
      const n = parseFloat(indice);
      const x = parseFloat(numero);
      
      if (n === 0) {
        this.passos.innerHTML = `<pre>Erro: Índice da raiz não pode ser zero.</pre>`;
        this.expressaoAtual = 'Erro';
      } else if (x < 0 && n % 2 === 0) {
        this.passos.innerHTML = `<pre>Erro: Raiz par de número negativo não é real.</pre>`;
        this.expressaoAtual = 'Erro';
      } else {
        const resultado = Math.pow(x, 1/n);
        this.registrarHistorico(`${n}√${x}`, resultado.toString());
        this.passos.innerHTML =
          `<pre><b>Raiz com Índice:</b>
${n}√${x} = ${x}^(1/${n})
Resultado: ${resultado}</pre>`;
        this.expressaoAtual = resultado.toString();
      }
    } catch {
      this.passos.innerHTML = `<pre>Erro: Valores inválidos para o cálculo da raiz.</pre>`;
      this.expressaoAtual = 'Erro';
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

  // Função que calcula o fatorial
  calcularFatorial() {
    try {
      const numeroExpr = prompt('Digite o número para calcular o fatorial (n):');
      if (numeroExpr === null) return;
      
      const numeroExprSanitizada = this.sanitizar(numeroExpr);
      
      const numero = math.evaluate(numeroExprSanitizada);
      
      if (!Number.isInteger(numero)) {
        this.passos.innerHTML = `<pre>Erro: O número deve ser um inteiro.
Número inserido: ${numeroExpr} = ${numero}</pre>`;
        this.expressaoAtual = 'Erro';
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }
      
      if (numero < 0) {
        this.passos.innerHTML = `<pre>Erro: O número deve ser não negativo (>= 0).
Número inserido: ${numeroExpr} = ${numero}</pre>`;
        this.expressaoAtual = 'Erro';
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }
      
      let resultado = 1;
      let calculo = '';
      
      if (numero === 0) {
        resultado = 1;
        calculo = '0! = 1 (por definição)';
      } else {
        calculo = `${numero}! = `;
        for (let i = numero; i >= 1; i--) {
          resultado *= i;
          if (i === numero) {
            calculo += i;
          } else {
            calculo += ` × ${i}`;
          }
        }
        calculo += ` = ${resultado}`;
      }
      
      this.passos.innerHTML = `<pre><b>Cálculo do fatorial:</b>
Expressão: ${numeroExpr}
Valor: ${numero}

${calculo}</pre>`;
      
      this.expressaoAtual = resultado.toString();
      this.registrarHistorico(`${numero}!`, resultado);
      
    } catch (error) {
      this.passos.innerHTML = `<pre>Erro: Expressão inválida. Verifique a sintaxe.
Detalhes: ${error.message}</pre>`;
      this.expressaoAtual = 'Erro';
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

  calcularLogaritmo() {
    try {
      const baseExpr = prompt('Digite a base do logaritmo (b):');
      if (baseExpr === null) return;
      
      const argumentoExpr = prompt('Digite o argumento do logaritmo (x):');
      if (argumentoExpr === null) return;
      
      const baseExprSanitizada = this.sanitizar(baseExpr);
      const argumentoExprSanitizado = this.sanitizar(argumentoExpr);
      
      const base = math.evaluate(baseExprSanitizada);
      const argumento = math.evaluate(argumentoExprSanitizado);
      
      if (base <= 0) {
        this.passos.innerHTML = `<pre>Erro: A base deve ser maior que 0.
Base inserida: ${baseExpr} = ${base}</pre>`;
        this.expressaoAtual = 'Erro';
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }
      
      if (base === 1) {
        this.passos.innerHTML = `<pre>Erro: A base não pode ser igual a 1.
Base inserida: ${baseExpr} = ${base}</pre>`;
        this.expressaoAtual = 'Erro';
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }
      
      if (argumento <= 0) {
        this.passos.innerHTML = `<pre>Erro: O argumento deve ser maior que 0.
Argumento inserido: ${argumentoExpr} = ${argumento}</pre>`;
        this.expressaoAtual = 'Erro';
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }
      
      const lnArgumento = Math.log(argumento);
      const lnBase = Math.log(base);
      const resultado = lnArgumento / lnBase;
      
      this.passos.innerHTML = `<pre><b>Cálculo do logaritmo personalizado:</b>
Expressão da base: ${baseExpr}
Valor da base: ${base}
Expressão do argumento: ${argumentoExpr}
Valor do argumento: ${argumento}

Fórmula: log_${base}(${argumento}) = ln(${argumento}) / ln(${base})
ln(${argumento}) = ${lnArgumento}
ln(${base}) = ${lnBase}
Resultado: ${lnArgumento} / ${lnBase} = ${resultado}</pre>`;
      
      this.expressaoAtual = resultado.toString();
      this.registrarHistorico(`log_${base}(${argumento})`, resultado);
      
    } catch (error) {
      this.passos.innerHTML = `<pre>Erro: Expressão inválida. Verifique a sintaxe.
Detalhes: ${error.message}</pre>`;
      this.expressaoAtual = 'Erro';
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

  calcularOperacoesFracoes() {
    try {
      const quantidadeStr = prompt('Quantas frações você quer usar?');
      if (quantidadeStr === null) return;
      
      const quantidade = parseInt(quantidadeStr);
      if (isNaN(quantidade) || quantidade < 1) {
        this.passos.innerHTML = `<pre>Erro: Digite um número válido maior ou igual a 1.</pre>`;
        this.expressaoAtual = 'Erro';
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }

      if (quantidade === 1) {
        const numeradorExpr = prompt('Digite o numerador:');
        if (numeradorExpr === null) return; 
        
        const denominadorExpr = prompt('Digite o denominador:');
        if (denominadorExpr === null) return;
        
        const numExprSanitizada = this.sanitizar(numeradorExpr);
        const denExprSanitizada = this.sanitizar(denominadorExpr);
        
        const num = math.evaluate(numExprSanitizada);
        const den = math.evaluate(denExprSanitizada);
        
        if (den === 0) {
          this.passos.innerHTML = `<pre>Erro: Divisão por zero não é permitida.
Numerador: ${numeradorExpr} = ${num}
Denominador: ${denominadorExpr} = ${den}</pre>`;
          this.expressaoAtual = 'Erro';
          this.limparAoDigitar = true;
          this.atualizarDisplay();
          return;
        }
        
        const resultado = num / den;
        
        this.passos.innerHTML = `<pre><b>Cálculo da fração:</b>
Expressão do numerador: ${numeradorExpr}
Valor do numerador: ${num}
Expressão do denominador: ${denominadorExpr}
Valor do denominador: ${den}
Resultado: ${num} ÷ ${den} = ${resultado}</pre>`;
        
        this.expressaoAtual = resultado.toString();
        this.registrarHistorico(`(${numeradorExpr})/(${denominadorExpr})`, resultado);
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }

      // Para múltiplas frações (quantidade >= 2)
      if (quantidade < 2) {
        this.passos.innerHTML = `<pre>Erro: Para operações entre frações, digite um número maior ou igual a 2.</pre>`;
        this.expressaoAtual = 'Erro';
        this.limparAoDigitar = true;
        this.atualizarDisplay();
        return;
      }
      
      const fracoes = [];
      const operacoes = [];
      
      // Coleta as frações
      for (let i = 0; i < quantidade; i++) {
        const numeradorExpr = prompt(`Fração ${i + 1} - Digite o numerador (pode ser uma expressão):`);
        if (numeradorExpr === null) return; 
        
        const denominadorExpr = prompt(`Fração ${i + 1} - Digite o denominador (pode ser uma expressão):`);
        if (denominadorExpr === null) return;
        
        const numExprSanitizada = this.sanitizar(numeradorExpr);
        const denExprSanitizada = this.sanitizar(denominadorExpr);
        
        const num = math.evaluate(numExprSanitizada);
        const den = math.evaluate(denExprSanitizada);
        
        if (den === 0) {
          this.passos.innerHTML = `<pre>Erro: Denominador da fração ${i + 1} é zero.
Numerador: ${numeradorExpr} = ${num}
Denominador: ${denominadorExpr} = ${den}</pre>`;
          this.expressaoAtual = 'Erro';
          this.limparAoDigitar = true;
          this.atualizarDisplay();
          return;
        }
        
        fracoes.push({
          numeradorExpr,
          denominadorExpr,
          numerador: num,
          denominador: den,
          valor: num / den
        });
      }
      
      // Coleta as operações entre as frações
      for (let i = 0; i < quantidade - 1; i++) {
        const operacao = prompt(`Operação entre fração ${i + 1} e fração ${i + 2}:\n+, -, *, /`);
        if (operacao === null) return;
        
        if (!['+', '-', '*', '/'].includes(operacao)) {
          this.passos.innerHTML = `<pre>Erro: Operação inválida "${operacao}". Use apenas +, -, *, /</pre>`;
          this.expressaoAtual = 'Erro';
          this.limparAoDigitar = true;
          this.atualizarDisplay();
          return;
        }
        
        operacoes.push(operacao);
      }
      
      // Calcula o resultado
      let resultado = fracoes[0].valor;
      let expressaoCompleta = `(${fracoes[0].numeradorExpr})/(${fracoes[0].denominadorExpr})`;
      let passosDetalhados = `<b>Operações entre ${quantidade} frações:</b>\n\n`;
      
      // Mostra as frações
      for (let i = 0; i < fracoes.length; i++) {
        const f = fracoes[i];
        passosDetalhados += `Fração ${i + 1}: (${f.numeradorExpr})/(${f.denominadorExpr}) = ${f.numerador}/${f.denominador} = ${f.valor}\n`;
      }
      
      passosDetalhados += `\nCálculo passo a passo:\n`;
      passosDetalhados += `Resultado inicial: ${fracoes[0].valor}\n`;
      
      // Aplica as operações sequencialmente
      for (let i = 0; i < operacoes.length; i++) {
        const operacao = operacoes[i];
        const proximaFracao = fracoes[i + 1];
        const valorAnterior = resultado;
        
        switch (operacao) {
          case '+':
            resultado += proximaFracao.valor;
            break;
          case '-':
            resultado -= proximaFracao.valor;
            break;
          case '*':
            resultado *= proximaFracao.valor;
            break;
          case '/':
            if (proximaFracao.valor === 0) {
              this.passos.innerHTML = `<pre>Erro: Divisão por zero na operação ${i + 1}.</pre>`;
              this.expressaoAtual = 'Erro';
              this.limparAoDigitar = true;
              this.atualizarDisplay();
              return;
            }
            resultado /= proximaFracao.valor;
            break;
        }
        
        expressaoCompleta += ` ${operacao} (${proximaFracao.numeradorExpr})/(${proximaFracao.denominadorExpr})`;
        passosDetalhados += `${valorAnterior} ${operacao} ${proximaFracao.valor} = ${resultado}\n`;
      }
      
      passosDetalhados += `\nResultado final: ${resultado}`;
      
      this.passos.innerHTML = `<pre>${passosDetalhados}</pre>`;
      this.expressaoAtual = resultado.toString();
      this.registrarHistorico(expressaoCompleta, resultado);
      
    } catch (error) {
      this.passos.innerHTML = `<pre>Erro: Expressão inválida ou erro no cálculo.
Detalhes: ${error.message}</pre>`;
      this.expressaoAtual = 'Erro';
    }
    this.limparAoDigitar = true;
    this.atualizarDisplay();
  }

  // Histórico
  registrarHistorico(expr, resultado) {
    this.historico.unshift({ expr, resultado, t: new Date().toISOString() });
    if (this.historico.length > 50) this.historico.pop();
    localStorage.setItem('calc_historico', JSON.stringify(this.historico));
  }

  //Plotar Gráfico
  plotarGrafico() {
    const func = this.expressaoAtual;
    try {
      const xs = [], ys = [];
      for (let x = -10; x <= 10; x += 0.5) {
        xs.push(x);
        ys.push(math.evaluate(func, { x }));
      }
      graficoChart.data.labels = xs;
      graficoChart.data.datasets[0].data = ys;
      graficoChart.update();
    } catch {
      alert('Erro ao plotar. Digite uma função válida em x.');
    }
  }

  atualizarDisplay() {
    this.display.innerText = this.expressaoAtual;
  }

  // Alterna entre Radianos e Graus
  alternarModo(id) {
    if (id === 'btn-rad') {
      this.modoAngulo = 'rad';
    } else if (id === 'btn-deg') {
      this.modoAngulo = 'deg';
    }
    this.atualizarBotoesRadDeg();
  }

  atualizarBotoesRadDeg() {
    const btnRad = document.getElementById('btn-rad');
    const btnDeg = document.getElementById('btn-deg');
    
    if (this.modoAngulo === 'rad') {
      btnRad.classList.add('ativo');
      btnDeg.classList.remove('ativo');
    } else {
      btnDeg.classList.add('ativo');
      btnRad.classList.remove('ativo');
    }
  }

  converterAngulo(valor) {
    if (this.modoAngulo === 'deg') {
      return valor * Math.PI / 180;
    }
    return valor;
  }

  // Funções trigonométricas que consideram o modo de ângulo
  sinComModo(valor) {
    return Math.sin(this.converterAngulo(valor));
  }

  cosComModo(valor) {
    return Math.cos(this.converterAngulo(valor));
  }

  tanComModo(valor) {
    return Math.tan(this.converterAngulo(valor));
  }

  asinComModo(valor) {
    const resultado = Math.asin(valor);
    if (this.modoAngulo === 'deg') {
      return resultado * 180 / Math.PI;
    }
    return resultado;
  }

  acosComModo(valor) {
    const resultado = Math.acos(valor);
    if (this.modoAngulo === 'deg') {
      return resultado * 180 / Math.PI;
    }
    return resultado;
  }

  atanComModo(valor) {
    const resultado = Math.atan(valor);
    if (this.modoAngulo === 'deg') {
      return resultado * 180 / Math.PI;
    }
    return resultado;
  }
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  window.calc = new Calculadora();
});

// Gráfico com Chart.js
const ctx = document.getElementById('grafico').getContext('2d');
let graficoChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'f(x)',
      data: [],
      borderColor: 'blue',
      fill: false,
      pointRadius: 0
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'x' } },
      y: { title: { display: true, text: 'f(x)' } }
    }
  }
});
