import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { PassengerDTO } from './dto/passenger.dto';
import { IPassenger } from '../common/interfaces/passenger.interface';
import { PassengerMSG } from 'src/common/constants';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Passengers')
@Controller('api/v2/passenger')
export class PassengerController {

    private _clientProxyPassenger = this.clientProxy.clientProxyPassengers();

    constructor(
        private readonly clientProxy: ClientProxySuperFlights,
    ) { }

    @Post()
    create(@Body() passengerDTO: PassengerDTO): Observable<IPassenger> {
        return this._clientProxyPassenger.send(PassengerMSG.CREATE, passengerDTO);
    }

    @Get()
    findAll(): Observable<IPassenger[]> {
        return this._clientProxyPassenger.send(PassengerMSG.FIND_ALL, '');
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<IPassenger> {
        return this._clientProxyPassenger.send(PassengerMSG.FIND_ONE, id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() passengerDTO: PassengerDTO): Observable<IPassenger> {
        return this._clientProxyPassenger.send(PassengerMSG.UPDATE, { id, passengerDTO });
    }

    @Delete(':id')
    delete(@Param('id') id: string): Observable<any> {
        return this._clientProxyPassenger.send(PassengerMSG.DELETE, id);
    }
}
