import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect'

let locations: any = []

const getLocation = async(req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.uniqueID
  const location = locations.find((x: any) => x.id === id)

  if (location) {
    res.status(200).json({
      latitude: location.latitude,
      longitude: location.longitude,
      sharing: location.sharing,
      endTime: location.endTime,
      id: location.id
    })

  } else {
    res.status(200).json({success: false, message: 'Location not found'})
  }
}

const postCoordinates = async(req: NextApiRequest, res: NextApiResponse) => {
  const { latitude, longitude, sharing, endTime, id } = req.body
  const location = {
    latitude,
    longitude,
    sharing,
    endTime,
    id,
  }
  locations.push(location)
  const addedLocation = locations.find((x: any) => x.id === id)

  res.status(200).json({
    success: true,
    data: addedLocation,
  });
}

const updateCoordinates = async (req: NextApiRequest, res: NextApiResponse) => {
  const { latitude, longitude, id, endTime, sharing } = req.body;
  const locationIndex = locations.findIndex((x: any) => x.id === id)

  if (locationIndex !== -1) {
    locations[locationIndex] = {
      latitude,
      longitude,
      sharing,
      endTime,
      id,
    };
    res.status(200).json({ success: true, data: locations[locationIndex] });
  } else {
    res.status(200).json({ success: false, message: 'Location not foud for update' })
  }
};

const deleteLocation = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.uniqueID as string;
  const locationIndex = locations.findIndex((x: any) => x.id === id)
  
  if (locationIndex !== -1) {
    const updatedLocations = locations.filter((x: any) => x.id !== id)
    locations = updatedLocations
    res.status(200).json({ success: true, message: 'Location deleted successfully.' });
  } else {
    res.status(200).json({ success: false, message: 'Location not found.' });
  }
};

const handler = nextConnect<NextApiRequest, NextApiResponse>({})
  .get(getLocation)
  .post(postCoordinates)
  .put(updateCoordinates)
  .delete(deleteLocation)

export default handler;
