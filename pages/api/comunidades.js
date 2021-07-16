import { SiteClient} from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    
    if(request.method === 'POST'){
        const TOKEN = '48d5b24cd062dc608862e02c9c71dc';
    
        const client = new SiteClient(TOKEN);
        
        // Validar os dados antes de sair cadastrando
        const registroCriado = await client.items.create({
            itemType: "968617", // ID do Model de "Communities" criado pelo DATO
            ...request.body,
            // title: "Comunidade de Teste",
            // imageUrl: "https://github.com/fabriciocruzz.png",
            // creatorSlug:"fabriciocruzz"
        })
    
        console.log(registroCriado);
        
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })

        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}