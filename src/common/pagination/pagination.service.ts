import { Injectable, Inject } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './interfaces/paginated.interface';

@Injectable()
export class PaginationService {

    constructor(
        /**
     * Injecting Request into PaginationService
     * */ 
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    public async paginateQuery<T extends ObjectLiteral >(
        paginateQuery: PaginationQueryDto, 
        repository : Repository<T>
    ) : Promise<Paginated<T>> {
         let results = await repository.find({
            skip: ((paginateQuery?.page ?? 1) - 1) * (paginateQuery.limit ?? 10),
            take: paginateQuery.limit,
         })
         const baseURL = this.request.protocol + '://' + this.request.get('host') + '/';
         const newUrl = new URL(this.request.url, baseURL);
         console.log(newUrl, );

         /**
          * calculating page
          */
         const totalItems = await repository.count()
         const totalPages = Math.ceil(totalItems / (paginateQuery.limit ?? 10));
        const nextPage =
          (paginateQuery.page ?? 1) === totalPages
            ? (paginateQuery.page ?? 1)
            : (paginateQuery.page ?? 1) + 1;
        const previousPage =
          (paginateQuery.page ?? 1) === 1
            ? 1
            : (paginateQuery.page ?? 1) - 1;
        const finalResponse : Paginated<T> ={
            data: results,
            meta: {
                itemsPerPage: paginateQuery.limit ?? 10,
                totalItems,
                currentPage: paginateQuery.page ?? 1,
                totalPages,
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit ?? 10} &page=1`,
                next: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit ?? 10} &page=${nextPage}`,
                current: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit ?? 10} &page=${paginateQuery.page ?? 1}`,
                previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit ?? 10} &page=${previousPage}`,
                last: `${newUrl.origin}${newUrl.pathname}?limit=${paginateQuery.limit ?? 10} &page=${totalPages}`,
            },
        }
         return finalResponse ;
    }
    
}
