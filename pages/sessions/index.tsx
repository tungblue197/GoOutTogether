import http from 'api/http'
import { GetServerSidePropsContext, InferGetServerSidePropsType, GetStaticPaths } from 'next'

export default function indexPage() {
    return (
        <div>
            <button onClick={e => {
                http.get('/group').then(data => {
                    console.log('data: ', data);
                })
            }}>View Page</button>
        </div>
    )
}

