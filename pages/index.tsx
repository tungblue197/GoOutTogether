import TextInput from 'components/input'
import type { NextPage } from 'next'
import React from 'react'
import Header from 'components/header';
import Button from 'components/button';
import { useRouter } from 'next/router'
import urls from 'constants/urls';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { User } from 'types/user';
import http from 'api/http';
import { faArrowRight, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from 'react-modal';
import Map from 'components/map';
const Home: NextPage = () => {

  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    name: '',
    location: ''
  });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const handleLocationsChange = (_locations: any) => {
    setLocations(_locations)
    setIsOpenModal(false);
  }
  const createUser = () => {
    if(!locations || !locations.length){
      return Promise.reject({ messsage: 'Locations empty'});
    }
    return http.post('/users', {...formData, location: JSON.stringify(locations[0])});
  }

  const { isLoading, mutate } = useMutation(createUser, {
    onSuccess: (data: any) => {
      if(data.success){
        const { extra: { id } } = data;
        localStorage.setItem('uId', id);
        router.push(urls.GROUP_CREATE);
        localStorage.setItem('prePath', '/');
      }
      console.log('success : ', data);
    },
    onError: err => {
      console.log('error : ', err);
    }
  })
  const { name } = formData;
  return (
    <div className='container'>
      <div className='w-90 w-7/12 my-2 shadow rounded mx-auto'>
        <Header centerTitle='Nhập thông tin của bạn' className='mb-2' />
        <form className='p-2'>
          <TextInput title='Tên của bạn' value={name} onChange={text => setFormData({ ...formData, name: text })}/>
          <div>
            <Button onClick={e => setIsOpenModal(true)}>Chọn địa điểm của bạn <FontAwesomeIcon className='ml-2' icon={faMapMarkedAlt} /> </Button>
            <span className='ml-2 text-sm text-blue-500'>
              {
                locations?.length ? locations[0].place_name : null 
              }
            </span>
          </div>
          <div className='flex justify-end'>
            <Button  onClick={e => {
              mutate();
            }} > Tiếp
              <FontAwesomeIcon className='ml-2' icon={faArrowRight} />
            </Button>
          </div>
        </form>
      </div>
      <Modal isOpen={isOpenModal}>
        <Map pickOnce p_locations={locations} onLocationsChanged={handleLocationsChange} />
      </Modal>
    </div>
  )
}

export default Home
