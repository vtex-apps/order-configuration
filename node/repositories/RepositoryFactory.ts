import {Repository} from "./Repository";
import {MasterData} from "@vtex/api";
import {ClientRepository} from "./ClientRepository";
import {OrderConfig} from "../models/OrderConfig";
import {Client} from "../models/Client";
import {OrderConfigurationRepository} from "./OrderConfigurationRepository";

export class RepositoryFactory {
  public static getClientRepository(masterData: MasterData): Repository<Client> {
    return new ClientRepository(masterData);
  }

  public static getOrderConfigurationRepository(masterData: MasterData): Repository<OrderConfig> {
    return new OrderConfigurationRepository(masterData);
  }
}
