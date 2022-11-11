import classes from "./TrendingStatsBox.module.scss";
import TrendingStatsCard from "../../cards/trendingStatsCard/TrendingStatsCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getItems } from "./fetchItems";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { currenciesActions } from "../../../store/currencies/currencies-slice";
import { changeDataVariables } from "../currenciesList/changeDataVariables";
import { CurrencyItem } from "../../../types/types";
export const TrendingStatsBox = () => {
  const dispatch = useDispatch();
  const { data, status, isError, isLoading } = useQuery(
    "trendItems",
    getItems,
    {
      refetchInterval: 600000,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      refetchOnMount: false,
    }
  );
  const { losersItems, gainersItems, trendingItems } = useSelector(
    (state: RootState) => state.currencies
  );
  const itemsExist =
    status === "success" && !!data.length && !isError && !isLoading;

  useEffect(() => {
    if (status === "success") {
      const items = data.map((i) => changeDataVariables(i) as CurrencyItem);
      dispatch(currenciesActions.setTrends(items));
    }
  }, [status, data]);
  return (
    <>
      {itemsExist && (
        <div className={classes.container}>
          <TrendingStatsCard
            title="Trending (7d)"
            kind="trending"
            items={trendingItems}
          />
          <TrendingStatsCard
            title="Losers (24h)"
            kind="losers"
            items={losersItems}
          />
          <TrendingStatsCard
            title="Gainers (24h)"
            kind="gainers"
            items={gainersItems}
          />
        </div>
      )}
    </>
  );
};
