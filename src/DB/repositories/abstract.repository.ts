import { Model, Query, QueryFilter, UpdateQuery } from 'mongoose';

export type Ipaginate = {
  page: number;
};
export type findOneArgs<TDocument> = {
  filter?: QueryFilter<TDocument>;
  select?: string;
  populate?: any;
};

export type findAllArgs<TDocument> = findOneArgs<TDocument> & {
  paginate?: Ipaginate;
  sort?: any;
};

export type updateArgs<TDocument> = {
  filter: QueryFilter<TDocument>;
  updatedDoc: UpdateQuery<TDocument>;
  select?: string;
  populate?: any;
};

export abstract class AbstractRepository<TDocument> {
  protected constructor(private readonly model: Model<TDocument>) {}

  async findOne({
    filter = {},
    select,
    populate,
  }: findOneArgs<TDocument>): Promise<TDocument | null> {
    const query = this.model.findOne(filter);
    if (select) query.select(select);
    if (populate) query.populate(populate);
    return query.exec();
  }

  async findAll({
    filter = {},
    select,
    populate,
    sort,
    paginate,
  }: findAllArgs<TDocument>): Promise<TDocument[] | any> {
    const query = this.model.find(filter);
    if (select) query.select(select);
    if (populate) query.populate(populate);
    if (sort) query.sort(sort);

    if (paginate?.page) {
      const { page } = paginate;

      const limit = 2;
      const skip = (page - 1) * limit;
      const totalSize = await query.model.countDocuments(query.getQuery());

      const data = await query.skip(skip).limit(limit).exec();

      return {
        totalSize,
        totalPages: Math.ceil(totalSize / limit),
        pageSize: data.length,
        pageNumber: page,
        data,
      };
    }

    const data = await query.exec();
    return { data };
  }

  async create(doc: Partial<TDocument>): Promise<TDocument> {
    return this.model.create(doc);
  }

  async update({
    filter,
    updatedDoc,
    select,
    populate,
  }: updateArgs<TDocument>): Promise<TDocument | null> {
    let query = this.model.findOneAndUpdate(filter, updatedDoc, {
      new: true,
      runValidators: true,
    });
    if (select) query.select(select);
    if (populate) query.populate(populate);
    return query.exec();
  }
  async delete(filter: QueryFilter<TDocument>): Promise<TDocument | null> {
    let query = this.model.findOneAndDelete(filter);
    return query.exec();
  }
}
