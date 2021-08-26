import TextInput from 'components/input'
import { NextPage } from 'next'
import React, { useState } from 'react'
import Header from 'components/header';
import Button from 'components/button';
import { useRouter } from 'next/router';
import { faTrash, faMapMarkerAlt, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from 'react-query';
import Map from 'components/map';
import Modal from 'react-modal';
import { Group } from 'types/group';
import { useMemo } from 'react';
import http from 'api/http';
import { getSessionPage } from 'constants/urls';

const Create: NextPage = () => {

    const router = useRouter()
    const [formData, setFormData] = useState<Group>({
        title: '',
        timeOut: 60000,
        content: ''
    });

    const [openModal, setOpenModel] = useState(false);
    const [locations, setLocations] = useState<any[]>([]);
    const handleLocationsChange = (_locations: any) => {
        setLocations(_locations)
        setOpenModel(false);
    }

    const handleRemoveLocation = (location_id: string) => {
        const newLocations = locations.filter(item => item.id !== location_id);
        setLocations(newLocations);
    }

    const handleValueChange = ({ value, name }: { value: any, name: string }) => {
        setFormData({ ...formData, [name]: value });
    }

    const createGroup =  () => {
        return http.post('/group/create', { ...formData, locations: JSON.stringify(locations)});
    }

    const getMinuteBySecond = useMemo(() => {
        if(formData.timeOut){
            return formData.timeOut / 60000;
        }
        return 1;
    }, [formData.timeOut]);
    const { isLoading, mutate } = useMutation(createGroup, {
        onSuccess: (data: any) => {
            const { extra: { id }} = data;
            router.push(getSessionPage(id));
        }
    })



    const { title, content } = formData;
    return (
        <div className='container'>
            <div className='w-90 w-7/12 my-2 shadow rounded mx-auto'>
                <Header centerTitle='Tạo group của bạn' className='mb-2' />
                <form className='p-2'>
                    <TextInput title='Tiêu đề' value={title} onChange={value => handleValueChange({ value, name: 'title' })} />
                    <TextInput title='Nội dung' value={content} onChange={value => handleValueChange({ value, name: 'content' })}  />
                    <div className='md:flex md:items-center mb-6'>
                        <div className="md:w-1/5">
                            <label className="block text-gray-500 md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                Thời gian
                            </label>
                        </div>
                        <div className='md:w-4/5'>
                            <div className="relative inline-block w-full text-gray-700">
                                <select name='timeOut' value={getMinuteBySecond} onChange={e => {
                                    const { value } = e.target;
                                    handleValueChange({ name: 'timeOut', value: Number(value) * 60000 });
                                }} className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" placeholder="Regular input">
                                    <option value={1}>1 Phút</option>
                                    <option value={5}>5 Phút</option>
                                    <option value={10}>10 Phút</option>
                                    <option value={20}>20 Phút</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-start justify-between'>
                        <Button onClick={e => setOpenModel(true)}>Chọn địa điểm <FontAwesomeIcon icon={faMapMarkerAlt} className='ml-1' /></Button>
                        {
                            locations.length ? (
                                <div className='ml-1 border rounded w-4/5'>

                                    <ul className="flex flex-col px-2 py-1">
                                        {
                                            locations.map((item, index) => (
                                                <li className='flex justify-between my-1 text-blue-400'>
                                                    <span className="text-sm">
                                                        {index + 1}. {item.place_name}
                                                    </span>
                                                    <FontAwesomeIcon onClick={e => handleRemoveLocation(item.id)} icon={faTrash} color={'#f87171'} />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            ) : null
                        }

                    </div>
                    <div className='flex justify-end mt-2'>
                        <Button disable={isLoading} onClick={e => mutate()}>Tạo nhóm <FontAwesomeIcon icon={faPlusSquare} className='ml-1'/></Button>
                    </div>
                </form>
            </div>
            <Modal isOpen={openModal}>
                <Map onLocationsChanged={handleLocationsChange} p_locations={locations} />
            </Modal>
        </div>
    )
}

export default Create
