import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isSidebarOpen = new BehaviorSubject<boolean>(true);
  public isSidebarOpen$ = this._isSidebarOpen.asObservable();

  constructor() {
    // Check screen size on init to set default state?
    // For now, default to open (desktop friendly), split-pane will handle mobile hiding automatically usually,
    // but we want manual toggle control.
  }

  toggleSidebar() {
    this._isSidebarOpen.next(!this._isSidebarOpen.value);
  }

  setSidebarState(isOpen: boolean) {
    this._isSidebarOpen.next(isOpen);
  }

  get isSidebarOpen(): boolean {
    return this._isSidebarOpen.value;
  }
}
