import React, { useEffect, useState } from 'react';
import './style/GardenInfos.scss';
import { Link } from 'react-router-dom';
/* import { UserContext } from './Contexts/UserContextProvider';
 */
import { getEntity, getCollection } from '../services/API';

const GardenInfos = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const [gardenInfos, setGardenInfos] = useState([]);
  const [actionList, setActionList] = useState([]);
  const [gardenZone, setGardenZone] = useState([]);
  const [actionToFeed, setActionToFeed] = useState([]);

  useEffect(() => {
    getCollection('actions').then((elem) => {
      setActionList(elem);
    });
  }, []);
  useEffect(() => {
    getEntity('garden', id).then((data) => {
      setGardenInfos(data);
    });
  }, []);
  useEffect(() => {
    if (gardenInfos) {
      getCollection(`garden/${id}/zones`).then((elem) => {
        setGardenZone(elem);
      });
    }
  }, [gardenInfos]);
  console.log(gardenZone);

  useEffect(() => {
    if (gardenInfos) {
      getCollection(`garden/${id}/zones`).then((elem) => {
        setGardenZone(elem);
      });
    }
  }, [gardenInfos]);
  console.log(gardenZone);

  useEffect(() => {
    if (gardenZone.length > 0) {
      gardenZone.map((elem) => {
        return getCollection(`garden/${id}/zones/${elem.id}/actionFeed`).then(
          (data) => {
            setActionToFeed((prevState) => [...prevState, data]);
          }
        );
      });
    }
  }, [gardenZone]);
  /*  useEffect(() => {
    if (gardenZone.length > 0) {
      getCollection(`garden/${id}/zones/${gardenZone[0].id}/actionFeed`).then(
        (data) => {
          setActionToFeed(data);
        }
      );
    }
  }, [gardenZone]); */
  console.log(actionToFeed);

  return (
    <div className="garden-list-container-infos">
      <div key={id} className="garden-row-infos">
        <div className="whitebar-infos">
          <div className="back-home-infos">
            <Link className="link-back-feed-garden" to="/garden">
              <div className="back-arrow-infos" />
              <div className="retour-infos">Retour</div>
            </Link>
          </div>
        </div>
        <img
          className="imgGarden-infos"
          src={gardenInfos.picture}
          alt="jardin"
        />
        <div className="detailsGarden">
          <h3>{gardenInfos.name}</h3>
          <p>{gardenInfos.description}</p>
          <p>Exposition : {gardenInfos.exposition}</p>
          <p>Adresse : {gardenInfos.address_id}</p>
        </div>
        <div>
          {gardenZone &&
            gardenZone.map((e) => {
              return (
                <div key={e.id} className="gardenZoneRow">
                  {e.name}
                </div>
              );
            })}
        </div>
        <div className="gardenAction">
          {actionList.map((e) => {
            return (
              <Link
                to={`/garden/${id}/action/${e.id}`}
                className={`action${e.id}`}
              >
                <div
                  key={e.id}
                  type="image"
                  alt="action"
                  contentEditable="false"
                  data-placeholder={e.name}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default GardenInfos;
