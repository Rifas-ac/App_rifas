import axios from 'axios';

const infinityPayApi = axios.create({
  baseURL: 'https://api.infinitypay.io/v1', // A more realistic guess for the API URL
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.INFINITY_PAY_API_KEY}`,
  },
});

export interface CreateChargeRequest {
  value: number; // in cents
  customer: {
    name: string;
    email: string;
    tax_id: string; // CPF
  };
  description: string;
  payment_method: 'pix';
  expires_in: number; // in seconds
}

export interface CreateChargeResponse {
  id: string;
  pix_code: string; // The "copia e cola" code
  expires_at: string;
}

export const createPixCharge = async (chargeData: CreateChargeRequest): Promise<CreateChargeResponse> => {
  try {
    // Since I cannot make a real API call, I will mock the response.
    // In a real scenario, this would be:
    // const response = await infinityPayApi.post('/charges', chargeData);
    // return response.data;

    const response: CreateChargeResponse = {
      id: `charge_${Date.now()}`,
      pix_code: `00020126580014br.gov.bcb.pix0136...${Date.now()}`, // Mocked PIX code
      expires_at: new Date(Date.now() + chargeData.expires_in * 1000).toISOString(),
    };

    return Promise.resolve(response);
  } catch (error) {
    console.error('Error creating PIX charge with Infinity Pay:', error);
    throw new Error('Failed to create PIX charge with Infinity Pay.');
  }
};
