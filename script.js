// script.js – Calculadora científica com passo a passo, gráfico e créditos
class Calculadora {
  constructor() {
    this.display = document.getElementById('display');
    this.passos = document.getElementById('passos');
    this.expressaoAtual = '0';
    this.limparAoDigitar = false;
    this.historico = JSON.parse(localStorage.getItem('calc_historico') || '[]');

    this.registrarEventos();
    this.atualizarDisplay();
  }

  registrarEventos() {
    // Cliques em botões numéricos e operadores
    document.querySelector('.botoes')
      .addEventListener('click', e => this.tratarClique(e.target));
    document.querySelector('.botoes-cientificos')
      .addEventListener('click', e => this.tratarClique(e.target));

    // Teclado físico
    window.addEventListener('keydown', e => {
      if (/^[0-9]$/.test(e.key)) this.adicionarNumero(e.key);
      if (['+','-','/','*','(',')','.','^'].includes(e.key)) this.adicionarOperador(e.key);
      if (e.key === 'Enter' || e.key === '=') this.calcular();
      if (e.key === 'Backspace') this.apagarUltimo();
    });

    // Botão de gráfico
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
      else if (id === 'btn-historico') alert(JSON.stringify(this.historico,null,2));
        else if (id === 'btn-toggle-theme') document.body.classList.toggle('dark');
              else if (id === 'btn-quadrado') this.adicionarOperador('^2');
      else if (id === 'btn-raiz') this.adicionarFuncao('sqrt(');

    }
  }

  /* -------- Manipulação de expressão -------- */
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

  /* -------- Cálculos -------- */
  sanitizar(expr) {
    return String(expr)
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .replace(/²/g, '^2')
      .replace(/\s+/g, '');
  }

calcular() {
  const expr = this.sanitizar(this.expressaoAtual);
  try {
    // simplifica direto a string da expressão
    const simplificado = math.simplify(expr).toString();
    // avalia a expressão Forma simplificada: ${simplificado}

    const resultado = math.evaluate(expr);
    const texto = math.format(resultado, { precision: 14 });

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

  /* -------- Histórico -------- */
  registrarHistorico(expr, resultado) {
    this.historico.unshift({ expr, resultado, t: new Date().toISOString() });
    if (this.historico.length > 50) this.historico.pop();
    localStorage.setItem('calc_historico', JSON.stringify(this.historico));
  }

  /* -------- Plotar Gráfico -------- */
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
}

/* -------- Inicialização -------- */
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
