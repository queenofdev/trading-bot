import { PaperTable, PaperTableCell, PaperTableHead } from "@fantohm/shared-ui-themes";
import { Box, CircularProgress, Container, TableBody, TableRow } from "@mui/material";
import { Offer } from "../../types/backend-types";
import { OfferListItem } from "./offer-list-item";
import style from "./offers-list.module.scss";

export enum OffersListFields {
  LENDER_PROFILE = "Offered by",
  LENDER_ADDRESS = "Lender",
  BORROWER_ADDRESS = "Borrower",
  OWNER_PROFILE = "Owner",
  REPAYMENT_TOTAL = "Total Repayment",
  PRINCIPAL = "Principal",
  TOTAL_INTEREST = "Interest",
  APR = "APR",
  DURATION = "Duration",
  EXPIRATION = "Expires",
  ASSET = "Asset",
  NAME = "Name",
  STATUS = "Status",
  CREATED_AGO = "Created",
}

export interface OffersListProps {
  offers: Offer[] | undefined;
  fields: OffersListFields[];
  isLoading?: boolean;
  title?: string;
}

export const OffersList = ({
  offers,
  fields,
  isLoading,
  title,
}: OffersListProps): JSX.Element => {
  if (isLoading) {
    return (
      <Box className="flex fr fj-c" sx={{ mb: "30px" }}>
        <CircularProgress />
      </Box>
    );
  }
  if ((!offers || offers.length < 1) && !isLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }
  return (
    <>
      <Container sx={{ mt: "30px" }}>
        <h2 className={style["title"]}>
          {title || "Offers"} ({!!offers && offers.length})
        </h2>
      </Container>
      <Container
        className={style["offerContainer"]}
        sx={{
          overflow: "auto",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "50px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#374FFF",
            borderRadius: "50px",
          },
        }}
      >
        <PaperTable>
          <PaperTableHead>
            <TableRow>
              {fields.map((field: OffersListFields, index: number) => (
                <PaperTableCell
                  key={`offer-table-header-${index}`}
                  className={style["offersHead"]}
                >
                  {field}
                </PaperTableCell>
              ))}
              <PaperTableCell></PaperTableCell>
            </TableRow>
          </PaperTableHead>
          <TableBody>
            {offers &&
              !isLoading &&
              offers.map(
                (offer: Offer, index: number) =>
                  offer?.assetListing && (
                    <OfferListItem key={`offer-${index}`} offer={offer} fields={fields} />
                  )
              )}
          </TableBody>
        </PaperTable>
      </Container>
    </>
  );
};

export default OffersList;
