import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public banki = [
    {nazwa: "ING", fix: 5000, perc: 1},
    {nazwa: "PKO", fix: 0, perc: 2},
    {nazwa: "Alior", fix: 10000, perc: 0},
    {nazwa: "Nordea", fix: 0, perc: 3},
    {nazwa: "mBank", fix: 1000, perc: 2.5},
  ]
  constructor() {}
  public raty: any[];
  public kwotaKredytu: any = 0;
  public active = false;

  calculateForBank(bank) {
    return (bank.fix + Number(this.kwotaKredytu) * (1 + bank.perc / 100)).toFixed(2);
  }

  obliczProwizje(bank) {
    return (bank.fix + Number(this.kwotaKredytu) * (1 + bank.perc / 100) - Number(this.kwotaKredytu)).toFixed(2);
  }

  calculate(form) {
    this.active = true;
    const czestotliwosc = form.value.lm === 'l' ? 12 : 1;
    const N = form.value.okres * czestotliwosc

    const a = [...Array(N).keys()].map((num) => num + 1);
    if (form.value.rodzaj === 'a') {
      this.raty = a.map((numerRaty) => {
        const r = form.value.oprocentowanie / 1200;
        const result = form.value.kwota * (r * (1 + r) ** N) / ( (1 + r) ** N - 1)
        return result;
      });
      this.kwotaKredytu = this.raty.reduce((prev, curr) => {
        return prev + curr;
      }).toFixed(2);
      this.raty = this.raty.map((rata) => rata.toFixed(2));
    } else {
      this.raty = a.map((numerRaty) => {
        const r = form.value.oprocentowanie / 1200;
        const result = form.value.kwota / N * (1 + (N - numerRaty + 1) * r);
        return result;
      });
      this.kwotaKredytu = this.raty.reduce((prev, curr) => {
        return prev + curr;
      }).toFixed(2);
      this.raty = this.raty.map((rata) => rata.toFixed(2));
    }
  }
}
