export class ApiResponseWrapper<T> {
  constructor(
    public status: number,
    public ok: boolean,
    public body: T
  ) {}
}
