import {
  Avatar,
  Badge,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Collection } from "../../types/backend-types";

export interface CollectionsFilterProps {
  collections?: Collection[];
  collection: Collection;
  setCollection: Dispatch<SetStateAction<Collection>>;
  type: "lend" | "borrow";
}

export const CollectionsFilter = ({
  collections,
  collection,
  setCollection,
  type,
}: CollectionsFilterProps): JSX.Element => {
  const handleCollectionClick = useCallback(
    (newCollection: Collection) => {
      if (collection.slug === newCollection.slug) {
        setCollection({} as Collection);
      } else {
        setCollection(newCollection);
      }
    },
    [collection, setCollection]
  );
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader
          sx={{
            background: "none",
            padding: "40px 0 0 0",
            margin: "40px 0 20px 0",
            lineHeight: "20px",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            position: "static",
          }}
        >
          Collections
        </ListSubheader>
      }
    >
      {collections?.map((collectionMap: Collection, index: number) => (
        <ListItemButton
          key={`collection-filter-item-${index}`}
          onClick={() => {
            handleCollectionClick(collectionMap);
          }}
          selected={collection.slug === collectionMap.slug}
          sx={{
            padding: "10px 0",
          }}
        >
          <Badge
            badgeContent={type === "lend" ? collectionMap.openListingCount : undefined}
            color="secondary"
            overlap="circular"
            componentsProps={{
              badge: {
                style: {
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                },
              },
            }}
          >
            <Avatar
              src={collectionMap.imageUrl}
              sx={{
                borderRadius: "50px",
                border: "3px solid #fff",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                margin: "0 10px 0 0",
                height: "60px",
                width: "60px",
              }}
            />
          </Badge>
          <ListItemText primary={collectionMap.name} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default CollectionsFilter;
