import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FlightMSG } from 'src/common/constants';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { FlightDTO } from './dto/flight.dto';
import { PassengerMSG } from '../common/constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Flights')
@Controller('api/v2/flight')
export class FlightController {
    private _clientProxyFlight = this.clientProxy.clientProxyFlights();
    private _clientProxyPassenger = this.clientProxy.clientProxyPassengers();

    constructor(
        private readonly clientProxy: ClientProxySuperFlights,
    ) { }

    @Post()
    create(@Body() flightDTO: FlightDTO): Observable<IFlight> {
        return this._clientProxyFlight.send(FlightMSG.CREATE, flightDTO);
    }

    @Get()
    findAll(): Observable<IFlight[]> {
        return this._clientProxyFlight.send(FlightMSG.FIND_ALL, '');
    }

    @Get(':id')
    findOne(@Param('id') id: string): Observable<IFlight> {
        return this._clientProxyFlight.send(FlightMSG.FIND_ONE, id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() flightDTO: FlightDTO): Observable<IFlight> {
        return this._clientProxyFlight.send(FlightMSG.UPDATE, { id, flightDTO });
    }

    @Delete(':id')
    delete(@Param('id') id: string): Observable<any> {
        return this._clientProxyFlight.send(FlightMSG.DELETE, id);
    }

    @Post(':flightId/passenger/:passengerId')
    async addPassenger(@Param('flightId') flightId: string, @Param('passengerId') passengerId: string){
        const passenger = await this._clientProxyPassenger.send(PassengerMSG.FIND_ONE, passengerId).toPromise();

        if(!passenger) throw new HttpException('Passenser Not Found',HttpStatus.NOT_FOUND);

        return this._clientProxyFlight.send(FlightMSG.ADD_PASSENGER,{
            flightId,passengerId
        });
    }
}
