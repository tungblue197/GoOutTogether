import Button from 'components/button'
import { GetServerSidePropsContext, InferGetServerSidePropsType, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

export default function indexPage() {
    const router = useRouter();
    return (
        <div className='container mt-8'>
            <h1 className='text-center text-red-500 text-3xl'>Cuộc bình chọn đã kế thúc</h1>
            <div className='text-center pt-4'>
                <Button onClick={e => router.replace('/')}>
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    )
}

