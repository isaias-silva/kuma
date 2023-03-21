import { HttpStatus } from '@nestjs/common';

export class ResponseOfRequest {
    constructor(public readonly mensagem: string, public readonly status: HttpStatus) { }

    sendResponse(response: any, data: any) {
        response.status(this.status).json({
            mensagem: this.mensagem,
            data
        });
    }
}
