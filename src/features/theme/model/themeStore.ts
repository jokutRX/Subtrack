import { makeAutoObservable } from 'mobx'

type Theme = 'light' | 'dark'

class ThemeStore {
  theme: Theme = (localStorage.getItem('subtrack_theme') as Theme) || 'light'

  constructor() {
    makeAutoObservable(this)
    this.apply()
  }

  toggle = () => {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('subtrack_theme', this.theme)
    this.apply()
  }

  private apply() {
    document.documentElement.classList.toggle('dark', this.theme === 'dark')
  }
}

export const themeStore = new ThemeStore()