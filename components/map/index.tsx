import React, { useState } from 'react'
import { faTrash, faSearch, faSearchLocation, faTimes, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactMapGL, { Marker } from 'react-map-gl';
import map from 'constants/map';
import Header from 'components/header';
import { useMemo } from 'react';
import Button from 'components/button';
import Image from 'next/image';

import axios from 'axios';
import { images } from 'constants/Images';
import { useEffect } from 'react';

export interface IMapProps {
    onLocationsChanged?: (e: any) => any;
    p_locations?: any;
    pickOnce?: boolean;
}

const Map: React.FC<IMapProps> = ({ onLocationsChanged, p_locations, pickOnce = false }) => {

    useEffect(() => {
        if(!p_locations) return;
        setPickingLocations(p_locations);
        if (p_locations.length) {
            const clocation = p_locations[p_locations.length - 1];
            const { center } = clocation as any;
            setViewport({
                longitude: center[0],
                latitude: center[1],
                zoom: 12
            });
        }

    }, [p_locations]);

    const [viewport, setViewport] = useState({
        latitude: 21.028511,
        longitude: 105.804817,
        zoom: 8
    });
    const [textSearch, setTextSearch] = useState('');
    const [locations, setLocations] = useState<any[]>([]);
    const [pickingLocations, setPickingLocations] = useState<any[]>([]);

    const handlePickLocation = (item: string) => {
        setTextSearch('');
        const { center } = item as any;
        setViewport({
            longitude: center[0],
            latitude: center[1],
            zoom: 12
        });
        if(pickOnce){
            setPickingLocations([item]);
            return;
        }
        setPickingLocations([...pickingLocations, item]);
    }

    const searchLocation = (textSearch: string) => {
        if (!textSearch) return;
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${textSearch}.json?access_token=${map.ASSET_TOKEN}`)
            .then(({ data }) => {
                setLocations(data.features);
            })
    }
    const handleRemoveLocation = (location_id: string) => {
        const newPickingLocations = pickingLocations.filter(item => item.id !== location_id);
        setPickingLocations(newPickingLocations);
    }

    const getInputIcon = useMemo(() => {
        if (textSearch) return <FontAwesomeIcon className='mr-2 text-gray-600' onClick={e => setTextSearch('')} icon={faTimes} />
        return <FontAwesomeIcon className='mr-2 text-gray-600' icon={faSearch} />
    }, [textSearch]);

    const getResultClass = useMemo(() => {
        return pickingLocations.length ? 'open' : ''
    }, [pickingLocations.length])

    return (
        <div className='map'>
            <div className="flex justify-between map__header">
                <div className='p-2 search'>
                    <input type="text" className="text-xs search__input" value={textSearch} onChange={e => {
                        setTextSearch(e.target.value)
                        searchLocation(e.target.value);
                    }} />
                    {getInputIcon}
                    {
                        textSearch && <div className='w-full search__result-box py-2'>
                            <ul className="search__list-result">
                                {
                                    locations.map(item => <li key={item.id} onClick={e => handlePickLocation(item)} className="text-xs text-gray-600 px-2 py-2 search__item-result cursor-poiter hover:text-red-500"><FontAwesomeIcon icon={faSearchLocation} className='ml-1' /> - {item.place_name}</li>)
                                }
                            </ul>
                        </div>
                    }

                </div>
                <div>
                    <Button onClick={e => onLocationsChanged && onLocationsChanged(pickingLocations)}><FontAwesomeIcon icon={faSave} /></Button>
                </div>
            </div>

            <div className="map-container">
                <ReactMapGL
                    {...viewport}
                    mapboxApiAccessToken={map.ASSET_TOKEN}
                    width='100%'
                    height='100%'
                    onViewportChange={(e: any) => setViewport(e)}
                >
                    {pickingLocations?.length ? pickingLocations.map((item, i) => <Marker key={item.center[0].toString() + item.center[1].toString()} longitude={item.center[0]} latitude={item.center[1]} >
                        <div className='location-marker'>
                            <span>{i + 1}</span>
                            <Image src={images.locationIcon} width={36} height={36} />
                        </div>
                    </Marker>) : null}
                </ReactMapGL>
                <ul className={`map__list-location ${getResultClass}`}>
                    <Header centerTitle='Danh sách địa điểm' className='mb-2' />
                    {
                        pickingLocations.map((item, index) => <li className='cursor-pointer text-xs p-1 text-blue-400' key={item.center[0].toString() + item.center[1].toString()}>{`${(index + 1)} - ${item.place_name}`} <FontAwesomeIcon onClick={e => handleRemoveLocation(item.id)} className='ml-1 text-red-500' icon={faTrash} /></li>)
                    }
                </ul>
            </div>
        </div>
    )
}

export default Map
