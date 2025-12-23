class ApiError extends Error {
  public status: number;
  public details: any;

  constructor(status: number, details: any, message?: string) {
    super(message || `API Error: ${status}`);
    this.status = status;
    this.details = details;
    this.name = "ApiError";
  }
}

export default ApiError;
