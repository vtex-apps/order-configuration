import {Repository} from "./Repository";
import {OrderConfig} from "../models/OrderConfig";
import {MasterData} from "@vtex/api";
import {Schemas} from "../resolvers/orderConfiguration/enums/Schemas";
import {DataEntity} from "../resolvers/orderConfiguration/enums/DataEntity";

export class OrderConfigurationRepository extends Repository<OrderConfig> {
  public constructor(masterData: MasterData) {
    super(masterData, DataEntity.ORDER_CONFIG, Schemas.ORDER_CONFIGURATION, true);
  }
}