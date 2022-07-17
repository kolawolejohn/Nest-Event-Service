import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository, Like } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './dto';
import { Events } from './entity/events.entity';


@Controller('events')
export class EventsController {
    constructor(
        @InjectRepository(Events)
        private readonly repository: Repository<Events>
    ){}

    @Get()
    async findAll(){
       return await this.repository.find()
    }
    @Get('practice')
    async practice(){
        return await this.repository.find({
            select: ['id', 'when', 'address'], //if you use select, you are specifying the colums you want selected
            /**
             * SELECT * FROM events WHERE (events.id > 3) 
                    AND events.when > '2021-02-12T13:00:00'
                    OR events.description LIKE('%meet%)
               ORDER BY events.id DESC
             * LIMIT 2 
             * */
            where: [{
                id: MoreThan(3),
                when: MoreThan(new Date('2021-02-12T13:00:00'))
            },{
                description: Like('%meet%')
            },
        ],
        take: 2,
        order: {
            id: 'DESC'
        }
            
        })
    }
    @Get(':id')
    async findOne(@Param('id') id){
        return await this.repository.findOne(id)
    }

    @Post()
    async create(@Body() input: CreateEventDto){
        await this.repository.save ({
            ...input,
            when: new Date(input.when)
        })
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto){
        const event = await this.repository.findOne(id)
        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        })
    }


    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id){
        const event = await this.repository.findOne(id)
        await this.repository.remove(event)
    }
}
