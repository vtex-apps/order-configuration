import {DataEntity} from "../resolvers/orderConfiguration/enums/DataEntity";
import {MasterData} from "@vtex/api";
import {Schema} from "../models/Schema";
import {Schemas} from "../resolvers/orderConfiguration/enums/Schemas";

export class Repository<T> {

  public constructor(private readonly masterData: MasterData,
                     private readonly dataEntity: DataEntity,
                     private readonly schema: Schemas,
                     private readonly shouldEnforceSchema: boolean) {
  }

  public async get(id: string): Promise<T> {
    const document: Record<string, string | number> = await this.masterData.getDocument({
      dataEntity: this.dataEntity,
      id,
      fields: ["_all"]
    });
    const conformingToSchemaDocument = await this.onlyInSchema(document);
    return {...conformingToSchemaDocument, id: document.id} as unknown as T;
  }

  public async save(fields: Record<string, string | number>): Promise<string> {
    const fieldsInSchema = await this.onlyInSchema(fields);
    const documentResponse = await this.masterData.createDocument({
      dataEntity: this.dataEntity,
      schema: this.schema,
      fields: fieldsInSchema,
    });
    return documentResponse.Id;
  }

  public async update(id: string, fields: Record<string, string | number>): Promise<void> {
    const fieldsInSchema = await this.onlyInSchema(fields);
    return await this.masterData.updatePartialDocument({
      dataEntity: this.dataEntity,
      id,
      fields: fieldsInSchema,
      schema: this.schema,
    });
  }

  public async find(fields: Record<string, string | number>,
                    pagination: { page: number; pageSize: number} = { page: 1, pageSize: 20 }): Promise<T[]> {
    const whereClause = Repository.buildWhereClause(fields);
    const documents: Record<string, string | number>[] = await this.masterData.searchDocuments({
      dataEntity: this.dataEntity,
      schema: this.schema,
      fields: ["_all"],
      where: whereClause,
      pagination
    });
    const conformingDocuments: T[] = [];
    for (let document of documents) {
      conformingDocuments.push({...await this.onlyInSchema(document), id: document.id } as unknown as T);
    }
    return conformingDocuments;
  }

  public async findOne(fields: Record<string, string | number>): Promise<T | null> {
    const documents = await this.find(fields);
    if (documents.length === 0) {
      return null;
    }
    return documents[0];
  }

  private async getSchema(): Promise<Schema> {
    return await this.masterData.getSchema({
      dataEntity: this.dataEntity,
      schema: this.schema,
    });
  }

  private async onlyInSchema(document: Record<string, string | number>): Promise<Record<string, string | number>> {
    if (!this.shouldEnforceSchema) {
      return document;
    }
    const schema = await this.getSchema();
    const conformingToSchema: Record<string, string | number> = {};
    for (let key of Object.keys(document)) {
      if (schema.properties[key]) {
        conformingToSchema[key] = document[key];
      }
    }
    return conformingToSchema;
  }

  private static buildWhereClause(fields: Record<string, string | number>): string {
    const separateClauses = []
    for(let field of Object.keys(fields)) {
      separateClauses.push(`${field}=${fields[field]}`)
    }
    return separateClauses.join(" AND ");
  }
}