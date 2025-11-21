export class ApiResponse {
  constructor(
    public code: number,
    public message: string,
    public type: string
  ) {}
}
