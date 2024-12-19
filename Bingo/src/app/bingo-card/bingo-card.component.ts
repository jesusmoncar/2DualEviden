import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bingo-card',
  standalone: false,
  templateUrl: './bingo-card.component.html',
  styleUrls: ['./bingo-card.component.css']
})
export class BingoCardComponent implements OnInit {

  carton: { value: number | null; marcado: boolean }[][] = [];
  numerosGenerados: number[] = [];
  numeroActual: number | null = null;
  intervalo: any;
  generandoNumeros = false;

  readonly rangoColumnas = [
    [1, 9],
    [10, 19],
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 79],
    [80, 90],
  ];

  ngOnInit() {
    do {
      this.generarCarton();
    } while (!this.cartonValidado());
  }

  ngOnDestroy() {
    clearInterval(this.intervalo); // Limpiar intervalo al destruir el componente
  }

  generarCarton() {
    const columnas: number[][] = this.rangoColumnas.map(([min, max]) =>
      this.getRandomNumbersInRange(min, max, 3)
    );

    // Crear filas con solo 5 números por fila
    this.carton = Array.from({ length: 3 }, () =>
      Array(9).fill(null).map(() => ({ value: null, marcado: false }))
    );

    for (let i = 0; i < 3; i++) {
      const introducirColumnas = this.getRandomIndexes(5);
      introducirColumnas.forEach((colIndex) => {
        this.carton[i][colIndex] = { value: columnas[colIndex].pop()!, marcado: false };
      });
    }

    // Ordenar columnas
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const sortedColumn = this.carton
        .map((row) => row[colIndex])
        .filter((cell) => cell.value !== null)
        .sort((a, b) => (a.value! - b.value!));

      let index = 0;
      this.carton.forEach((row) => {
        if (row[colIndex].value !== null) {
          row[colIndex] = sortedColumn[index++];
        }
      });
    }
  }

  // Generar números aleatorios cada 4 segundos
  toggleGeneracionNumeros() {
    if (this.generandoNumeros) {
      clearInterval(this.intervalo);
      this.generandoNumeros = false;
    } else {
      this.generandoNumeros = true;
      this.intervalo = setInterval(() => {
        let numero: number;
        do {
          numero = Math.floor(Math.random() * 90) + 1; // Números entre 1 y 90
        } while (this.numerosGenerados.includes(numero));

        // Coloca el número generado al principio del array
        this.numerosGenerados.unshift(numero);
        this.numeroActual = numero;

      }, 4000);
    }
  }

  // Comprobación si una línea está completamente marcada
  comprobarLinea() {
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const row = this.carton[rowIndex];
      if (row.every(cell => cell.marcado)) {  // Verifica si todos los números en la fila están marcados
        alert(`¡Has completado una línea en la fila ${rowIndex + 1}!`);
        return;
      }
    }
    alert('Aún no has completado ninguna línea.');
  }

  // Recorre cada columna y comprueba que al menos tenga un número y que nunca tenga 3 números
  private cartonValidado(): boolean {
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const columnNumbers = this.carton.map((row) => row[colIndex]).filter((cell) => cell.value !== null);
      if (columnNumbers.length === 0 || columnNumbers.length === 3) {
        return false;
      }
    }
    return true;
  }

  //rellena las columnas del carton
  public getRandomNumbersInRange(min: number, max: number, count: number): number[] {
    const numbers: number[] = [];
    while (numbers.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  }

  //función para asignar a cada columna el rango de números que debe de tener
  public getRandomIndexes(count: number): number[] {
    const indexes = Array.from({ length: 9 }, (_, i) => i);
    return indexes.sort(() => Math.random() - 0.5).slice(0, count);
  }

  numeroMarcado(rowIndex: number, colIndex: number) {
    const cell = this.carton[rowIndex][colIndex];
    if (cell.value !== null) {
      cell.marcado = true;
    }
  }
}
