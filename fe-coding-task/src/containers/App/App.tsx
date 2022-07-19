import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider, TextField,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useForm, SubmitHandler } from 'react-hook-form';
import clsx from 'clsx';

import { HouseTypeEnum } from '../../shared/enums/house-type.enum';
import {
  Quarters,
  QuartersOptions,
  generateBarChart,
  generateLineChart,
} from './constants';

import './App.css';
import { RequestQueryInterface } from '../../shared/interfaces/request-query.interface';
import { getStatistics } from '../../services/price.api';
import { ResponseInterface } from '../../shared/interfaces/response.interface';

type ParameterInputs = {
  quarterFrom: string,
  quarterTo: string,
  houseType: string,
};

const useStyles = makeStyles(() => createStyles({
  root: {
    background: '#fcfcfc',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    height: '100vh',
    padding: 0,
    boxSizing: 'border-box',
  },
  quarterSlider: {
    marginRight: 30,
    '& .MuiSlider-markLabel': {
      fontSize: 10,
    },
  },
  filterBox: {
    padding: 30,
    display: 'flex',
    alignItems: 'center',
  },
  fetchBtn: {
    padding: '10px 25px !important',
    whiteSpace: 'nowrap',
  },
  chartBox: {
    padding: 30,
  },
  menuItem: {
    textTransform: 'capitalize',
  },
  controlBar: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comment: {
    marginLeft: '1rem !important',
    marginRight: '1rem !important',
    flex: 1,
  },
}));

function App() {
  const { register, handleSubmit, setValue, watch } = useForm<ParameterInputs>();
  const [quarterFrom, quarterTo, houseType] = watch(['quarterFrom', 'quarterTo', 'houseType']);
  const classes = useStyles();

  const [comment, setComment] = useState<any>('');
  const [lineData, setLineData] = useState<any>();
  const [barData, setBarData] = useState<any>();
  const [fetchedData, setFetchedData] = useState<ResponseInterface>();
  const [chartType, setChartType] = useState('line');
  const [quarters, setQuarters] = useState<[number, number]>([0, QuartersOptions.length - 1]);

  const houseOptions = useMemo(() => Object.entries(HouseTypeEnum), []);
  const defaultFilters: Partial<ParameterInputs> = useMemo(() => {
    try {
      const storedFilterString = localStorage.getItem('filters');
      if (storedFilterString) {
        const { quarterFrom, quarterTo, houseType } = JSON.parse(storedFilterString);
        setQuarters([quarterFrom, quarterTo]);
        setValue('quarterFrom', quarterFrom);
        setValue('quarterTo', quarterTo);
        setValue('houseType', houseType);
        return { quarterFrom, quarterTo, houseType };
      }
    } catch (e) {
    }
    return {};
  }, []);

  useEffect(() => {
    fetchData();
    const storedComment = localStorage.getItem('comment');
    setComment(storedComment || '');
  }, []);

  useEffect(() => {
    if (quarterFrom || quarterTo || houseType) {
      localStorage.setItem('filters', JSON.stringify({ quarterFrom, quarterTo, houseType }));
    }
  }, [quarterFrom, quarterTo, houseType]);

  useEffect(() => {
    if (fetchedData) {
      const categories = Object.keys(fetchedData.dimension.Tid.category.label);
      const values = fetchedData.value;
      const lineChartSeries = [
        {
          color: '#13C2C2',
          type: 'area',
          name: 'Prices',
          data: values,
          fillOpacity: 0,
        },
      ];
      const barChartSeries = [
        {
          color: '#13c2c2',
          name: 'Prices',
          data: values,
          type: 'column',
        },
      ];

      setLineData(generateLineChart(categories, lineChartSeries));
      setBarData(generateBarChart(categories, barChartSeries));
    }
  }, [fetchedData]);

  const fetchData = async (houseType = '00', quarters: string[] = []) => {
    const result = await getStatistics(houseType, quarters);
    setFetchedData(result);
  };

  const valueLabelFormat = (value: number) => {
    return Quarters[value];
  };

  const handleChange = (event: Event, newValues: number | number[]) => {
    setValue('quarterFrom', (newValues as number[])[0].toString());
    setValue('quarterTo', (newValues as number[])[1].toString());
  };

  const saveComment = () => {
    localStorage.setItem('comment', comment);
  };

  const onSubmit: SubmitHandler<ParameterInputs> = (data) => {
    const { quarterFrom, quarterTo, houseType } = data;
    const quarters = Quarters.splice(+quarterFrom, +quarterTo);
    fetchData(houseType, quarters);
  };

  return (
    <div className={clsx(classes.root, 'App')}>
      <AppBar color="transparent" position="sticky">
        <form className={classes.filterBox} onSubmit={handleSubmit(onSubmit)}>
          <Slider
            className={classes.quarterSlider}
            defaultValue={defaultFilters.quarterFrom && defaultFilters.quarterTo
              ? [+defaultFilters.quarterFrom, +defaultFilters.quarterTo]
              : quarters}
            valueLabelDisplay="auto"
            getAriaValueText={valueLabelFormat}
            valueLabelFormat={valueLabelFormat}
            max={QuartersOptions.length - 1}
            marks={QuartersOptions}
            onChange={handleChange}
          />
          <input hidden defaultValue={defaultFilters.quarterFrom ?? quarters[0]} {...register('quarterFrom')} />
          <input hidden defaultValue={defaultFilters.quarterTo ?? quarters[1]} {...register('quarterTo')} />
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="house-type">House Type</InputLabel>
            <Select
              labelId="house-type"
              id="house-type"
              defaultValue={defaultFilters.houseType ?? houseOptions[0][0]}
              label="House Type"
              {...register('houseType')}
            >
              {houseOptions.map(([value, name]) => (
                <MenuItem key={name} value={value}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            className={classes.fetchBtn}
          >
            Fetch & Draw
          </Button>
        </form>
      </AppBar>
      <div className={classes.chartBox}>
        <div className={classes.controlBar}>
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel id="chart-type">Chart Type</InputLabel>
            <Select
              labelId="chart-type"
              id="chart-type"
              value={chartType}
              label="Chart Type"
              className={classes.menuItem}
              onChange={(e) => setChartType(e.target.value)}
            >
              {['line', 'bar'].map((type) => (
                <MenuItem
                  key={type}
                  value={type}
                  className={classes.menuItem}
                >
                  {type} Chart
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="comment"
            className={classes.comment}
            label="Comment"
            value={comment}
            variant="outlined"
            onChange={(e) => setComment(e.target.value)}
          />
          <Button variant="outlined" onClick={saveComment}>Save</Button>
        </div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartType === 'line' ? lineData : barData}
          allowChartUpdate={true}
        />
      </div>
    </div>
  );
}

export default App;
