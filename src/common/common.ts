class ApiResponse<T> {
  constructor(
    public data: T,
    public message: string = 'Success',
    public success: boolean = true,
  ) {}

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(data, message, true);
  }
}

export default ApiResponse;
