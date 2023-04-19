import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import { PassThrough } from "stream";
import PinataSDK, { PinataPinResponse } from "@pinata/sdk";
import * as Sentry from '@sentry/nextjs';

type IpfsUpload = PinataPinResponse & { Filename: string };

const pinata = new PinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const uploadPromises: Promise<IpfsUpload>[] = [];

    const form = new IncomingForm({
        multiples: true,
        keepExtensions: true,
        allowEmptyFiles: false,
        fileWriteStreamHandler: ({ newFilename, originalFilename }: File) => {
            const pass = new PassThrough();

            const Filename = originalFilename ?? newFilename;

            const promise = pinata.pinFileToIPFS(pass, {
                pinataMetadata: {
                    name: Filename,
                },
            }).then((results) : IpfsUpload => ({
                ...results,
                Filename,
            })).catch((error) => {
                throw new Error(
                    `Cannot upload ${Filename} file to IPFS`,
                    { cause: error }
                );
            });

            uploadPromises.push(promise);

            return pass;
        },
    });

    try {
        await new Promise((resolve, reject) => {        
            form.parse(req, (err, _, files) => {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });

        const uploads = await Promise.all(uploadPromises);

        return res.status(200).json({ message: "File uploaded successfully", uploads });
    } catch (error) {
        if (error instanceof Error) {
            Sentry.captureException(error);
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};