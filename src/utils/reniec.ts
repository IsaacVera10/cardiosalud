import axios from 'axios';

class ApisNetPe {
    private BASE_URL: string = "https://api.apis.net.pe";
    private token?: string;

    constructor(token?: string) {
        this.token = token;
    }

    private async _get(path: string, params: Record<string, any>): Promise<any> {
        const url = `${this.BASE_URL}${path}`;

        const headers = {
            "Accept": "application/json",
            "Authorization": `Bearer ${this.token}`
        };

        try {
            const response = await axios.get(url, { headers, params });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;
                switch (status) {
                    case 422:
                        console.warn(`${error.config.url} - invalid parameter`);
                        console.warn(error.response.data);
                        break;
                    case 403:
                        console.warn(`${error.config.url} - IP blocked`);
                        break;
                    case 429:
                        console.warn(`${error.config.url} - Too many requests, add delay`);
                        break;
                    case 401:
                        console.warn(`${error.config.url} - Invalid token or limited`);
                        break;
                    default:
                        console.warn(`${error.config.url} - Server error status_code=${status}`);
                        break;
                }
            } else {
                console.error('Error:', error.message);
            }
            return null;
        }
    }

    async getPerson(dni: string): Promise<any> {
        try {
            const response = await this._get("/v2/reniec/dni", { numero: dni });
            return response;
        } catch (error) {
            console.error('Error al consultar el DNI:', error);
            return null;
        }
    }

    async getCompany(ruc: string): Promise<any> {
        try {
            const response = await this._get("/v2/sunat/ruc", { numero: ruc });
            return response;
        } catch (error) {
            console.error('Error al consultar el RUC:', error);
            return null;
        }
    }

    async getExchangeRate(date: string): Promise<any> {
        try {
            const response = await this._get("/v2/sunat/tipo-cambio", { fecha: date });
            return response;
        } catch (error) {
            console.error('Error al consultar el tipo de cambio:', error);
            return null;
        }
    }

    async getExchangeRateToday(): Promise<any> {
        try {
            const response = await this._get("/v2/sunat/tipo-cambio", {});
            return response;
        } catch (error) {
            console.error('Error al consultar el tipo de cambio para hoy:', error);
            return null;
        }
    }

    async getExchangeRateForMonth(month: number, year: number): Promise<any> {
        try {
            const response = await this._get("/v2/sunat/tipo-cambio", { month, year });
            return response;
        } catch (error) {
            console.error('Error al consultar el tipo de cambio para el mes:', error);
            return null;
        }
    }
}

export default ApisNetPe;
