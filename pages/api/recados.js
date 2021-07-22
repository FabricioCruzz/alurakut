import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(request, response){

    if(request.method === 'POST'){
        const TOKEN = '48d5b24cd062dc608862e02c9c71dc';

        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: "972865",
            ...request.body,
        })

        response.json({
            dados: 'data',
            resgistroCriado: registroCriado,
        })

        return;
    }

    response.status(404).json({
        message: 'Erro no GET'
    })

}