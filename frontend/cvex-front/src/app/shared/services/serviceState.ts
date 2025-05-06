import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private storageKey = 'cardState';

  setCardState(card: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(card));
  }

  getCardState() {
    const card = localStorage.getItem(this.storageKey);
    return card ? JSON.parse(card) : null;
  }

  clearCardState() {
    localStorage.removeItem(this.storageKey);
  }
}
