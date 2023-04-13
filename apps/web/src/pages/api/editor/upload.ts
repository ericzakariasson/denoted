import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Files, errors } from "formidable";
import PinataSDK from '@pinata/sdk';

const { FormidableError } = errors;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const pinata = new PinataSDK({
            pinataApiKey: process.env.PINATA_API_KEY,
            pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
        });

        try {
            const form = new IncomingForm({
                multiples: true,
                keepExtensions: true,
                allowEmptyFiles: false,
                uploadDir: __dirname // TODO: use fileWriteStreamHandler instead
            });

            const files: Files = await new Promise((resolve, reject) => {        
                form.parse(req, (err, _, files) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(files);
                });
            });


            try {
                const ipfsResults = await Promise.all(Object.entries(files).map(async ([_, file]) => {
                    // const options = {
                    //     pinataMetadata: {
                    //         name: 'Some image',
                    //     },
                    //     pinataOptions: {
                    //         cidVersion: 0,
                    //     }
                    // };

                    // TODO: check if what File[] actually implies
                    if (Array.isArray(file)) { 
                        return res.status(400).json({ error: 'More than 1 file' });
                    }

                    const result = await pinata.pinFromFS(file.filepath);
        
                    return result;
                }));

                return res.status(200).json({ message: "File uploaded successfully", data: ipfsResults });
            } catch (error) {
                return res.status(500).json({ error });
            }
        } catch (error) {
            if (error instanceof FormidableError) {
                return res.status(500).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};