import {Repository} from "./Repository";
import {MasterData} from "@vtex/api";
import {DataEntity} from "../resolvers/orderConfiguration/enums/DataEntity";
import {Schemas} from "../resolvers/orderConfiguration/enums/Schemas";
import {Client} from "../models/Client";

export class ClientRepository extends Repository<Client> {
  public constructor(masterData: MasterData) {
    super(masterData, DataEntity.CLIENT, Schemas.CLIENT, false);
  }
}