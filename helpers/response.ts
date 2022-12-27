export type ResponseData<DataType> = {
  data?: DataType;
  errors?: string[];
  msg: string;
};

export interface ResponseObj<T> {
  data: ResponseData<T>;
  status: number;
}

const responseObj: <DataType>({
  msg,
  data,
  errors,
}: ResponseData<DataType>) => ResponseData<DataType> = <DataType>({
  data,
  errors,
  msg,
}: ResponseData<DataType>): ResponseData<DataType> => {
  return {
    data: data,
    errors: errors || [],
    msg: msg,
  };
};

export default responseObj;
