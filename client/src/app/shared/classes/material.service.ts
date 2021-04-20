declare var M;

export class MaterialService {
  static toast(message: string): void {
    M.toast({ html: message });
  }
}
