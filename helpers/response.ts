type ResponseData = {
  data?: object;
  errors?: string[];
  msg: string;
};

class Response {
  data: object;
  errors: string[] | undefined;
  msg: string;
  constructor({ data, errors, msg }: ResponseData) {
    this.data = data || {};
    this.errors = errors || [];
    this.msg = msg;
  }
}

export default Response;
