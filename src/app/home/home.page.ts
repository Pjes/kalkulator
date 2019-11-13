import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public banki = [
    {nazwa: "ING", fix: 5000, perc: 1, show: false},
    {nazwa: "PKO", fix: 0, perc: 2, show: false},
    {nazwa: "Alior", fix: 10000, perc: 0, show: false},
    {nazwa: "Nordea", fix: 0, perc: 3, show: false},
    {nazwa: "mBank", fix: 1000, perc: 2.5, show: false},
  ]
  constructor() {}
  public bestBank: any;
  public raty: any[];
  public kwotaKredytu: any = 0;
  public active = false;
  activate(bank){
    bank.show = !bank.show;
  }
  findBest() {
    this.bestBank = this.banki.reduce((acc, curr) => {
      acc = this.calculateForBank(acc) > this.calculateForBank(curr) ? curr : acc;
      return acc;
    }, this.banki[0]);
  }
  calculateForBank(bank) {
    return (bank.fix + Number(this.kwotaKredytu) * (1 + bank.perc / 100)).toFixed(2);
  }

  obliczProwizje(bank) {
    return (bank.fix + Number(this.kwotaKredytu) * (1 + bank.perc / 100) - Number(this.kwotaKredytu)).toFixed(2);
  }

  calculate(form) {
    this.active = true;
    const czestotliwosc = form.value.lm === 'l' ? 12 : 1;
    const N = form.value.okres * czestotliwosc;

    const a = [...Array(N).keys()].map((num) => num + 1);
    if (form.value.rodzaj === 'a') {
      this.raty = a.map((numerRaty) => {
        const r = form.value.oprocentowanie / 1200;
        const result = form.value.kwota * (r * (1 + r) ** N) / ( (1 + r) ** N - 1);
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
    this.findBest();
  }
}
