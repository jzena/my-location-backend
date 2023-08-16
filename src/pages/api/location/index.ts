import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect'

let locations: any = {}

const getLocation = async(req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.uniqueID
  const location = locations[id as string]
  if (req.query.uniqueID !== undefined && location) {
    res.status(200).json({
      latitude: location.latitude,
      longitude: location.longitude,
      endTime: location.endTime,
      sharing: location.sharing,
      id: location.id
    })
  } else {
    res.status(200).json({success: false, message: 'Location not found or time expired' })
  }
}

const postCoordinates = async(req: NextApiRequest, res: NextApiResponse) => {
  const { latitude, longitude, id, endTime, sharing } = req.body

  locations[id] = {
    latitude,
    longitude,
    endTime,
    sharing,
    id,
  };
  res.status(200).json({ success: true, data: locations[id] });
}

const updateCoordinates = async (req: NextApiRequest, res: NextApiResponse) => {
  const { latitude, longitude, id, endTime, sharing } = req.body;

  if (locations[id]) {
    locations[id] = {
      latitude,
      longitude,
      endTime,
      sharing,
      id,
    };
    res.status(200).json({ success: true, data: locations[id] });
  } else {
    res.status(404).json({ error: 'Location not found for update.' });
  }
};

const deleteCoordinates = async(req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.uniqueID;
  
  if (locations[id as string]) {
    delete locations[id as string];
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: 'Location not found.' });
  }
};

const handler = nextConnect<NextApiRequest, NextApiResponse>({})
  .get(getLocation)
  .post(postCoordinates)
  .put(updateCoordinates)
  .delete(deleteCoordinates);

export default handler;
