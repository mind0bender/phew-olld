import Phew, { PhewInterface } from "../../database/models/phew";
import { ResponseObj } from "../../helpers/response";
import { ShareablePhew } from "../../helpers/shareableModel";

export interface PhewCreationData {
  username: string;
  password?: string;
  content: string;
  isPublic: boolean;
}

export type PhewCreationResponse = ResponseObj<ShareablePhew>;

const phewController = {
  create: (phewData: PhewCreationData): Promise<PhewCreationResponse> => {
    return new Promise<PhewCreationResponse>(
      (
        resolve: (value: PhewCreationResponse) => void,
        reject: (reasons?: any) => void
      ): void => {
        const phew: PhewInterface = new Phew({});
      }
    );
  },
};

export default phewController;

// pink;
