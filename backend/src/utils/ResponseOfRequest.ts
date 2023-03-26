import { HttpStatus } from '@nestjs/common';

export class ResponseOfRequest {
    constructor(public readonly message: string, public readonly status: HttpStatus) { }

    sendResponse(response: any, data: any) {
        response.status(this.status).json({
            message: this.message,
            data
        });
    }
}
