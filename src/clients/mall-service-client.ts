import { EveClient } from "./eve-client";
import { Environment } from "../bootstrapping/environment";
import { Injectable } from "injection-js";
import { ObjectId } from "bson";
import { MallType } from "../models/marketplace-names";

@Injectable()
export class MallServiceClient extends EveClient {
  constructor(protected env: Environment) {
    super(env);
    this.baseUrl = this.env.MALL_SERVICE_URL;
  }

  async getDeliveryMethods(
    companyId: ObjectId
  ): Promise<ApiMallDeliveryMethod[]> {
    let response = await this.got.get(
      `/company/${companyId}/mall-delivery-methods`
    );
    return response.body;
  }
}

export interface ApiMallDeliveryMethod {
  code: string;
  title: string;
  marketplace: MallType;
}
