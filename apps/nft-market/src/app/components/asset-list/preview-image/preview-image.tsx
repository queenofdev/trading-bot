import { useMediaQuery } from "@material-ui/core";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import { Asset, CollectibleMediaType } from "../../../types/backend-types";
import previewNotAvailableLight from "../../../../assets/images/preview-not-available-light.png";
import previewNotAvailableDark from "../../../../assets/images/preview-not-available-dark.png";
import style from "./preview-image.module.scss";

export interface PreviewImageProps {
  asset: Asset;
  metaDataResponse: Asset | undefined;
}

export const PreviewImage = (props: PreviewImageProps): JSX.Element => {
  const themeType = useSelector((state: RootState) => state.theme.mode);
  const isTablet = useMediaQuery("(min-width:576px)");
  const asset =
    props.metaDataResponse !== undefined ? props.metaDataResponse : props.asset;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "end",
        height: isTablet ? "300px" : "130px",
        width: "300px",
        borderRadius: isTablet ? "28px" : "14px",
        overflow: "hidden",
      }}
      className={style["imgContainer"]}
    >
      {asset.mediaType === CollectibleMediaType.Video && asset.videoUrl && (
        <video controls>
          <source src={asset.videoUrl} />
        </video>
      )}
      {asset.mediaType === CollectibleMediaType.Gif && asset.gifUrl && (
        <img
          className={style["assetImg"]}
          src={
            asset.gifUrl ||
            (themeType === "dark" ? previewNotAvailableDark : previewNotAvailableLight)
          }
          alt={props.asset?.name || ""}
          style={{
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      {asset.mediaType === CollectibleMediaType.ThreeD && asset.threeDUrl && (
        <img
          className={style["assetImg"]}
          src={
            asset.fileUrl ||
            (themeType === "dark" ? previewNotAvailableDark : previewNotAvailableLight)
          }
          alt={props.asset?.name || ""}
          style={{
            height: "100%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      )}
      {asset.mediaType === CollectibleMediaType.Image &&
        ((asset?.imageUrl || "").startsWith("<svg") ? (
          <Box
            sx={{ width: "100%" }}
            dangerouslySetInnerHTML={{
              __html:
                asset.imageUrl ||
                (themeType === "dark"
                  ? previewNotAvailableDark
                  : previewNotAvailableLight),
            }}
          />
        ) : (
          <img
            className={style["assetImg"]}
            src={
              asset.imageUrl ||
              (themeType === "dark" ? previewNotAvailableDark : previewNotAvailableLight)
            }
            alt={props.asset?.name || ""}
            style={{
              height: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        ))}
      {asset.mediaType === CollectibleMediaType.Audio && asset.videoUrl && (
        <Box sx={{ width: "100%" }}>
          <img
            src={
              asset?.fileUrl ||
              (themeType === "dark" ? previewNotAvailableDark : previewNotAvailableLight)
            }
            alt={asset.name || "unknown"}
          />
          <audio controls src={asset.videoUrl} className={style["audio"]} />
        </Box>
      )}
      {asset.mediaType === CollectibleMediaType.Html && asset.videoUrl && (
        <iframe
          title={asset?.name || ""}
          src={asset.videoUrl}
          className={style["iframe"]}
        />
      )}
    </Box>
  );
};

export default PreviewImage;
