import { badRequest, notFound } from '@hapi/boom';
import { type NextFunction, type Request, type Response } from 'express';
import { param } from 'express-validator';
import { v4 as uuid } from 'uuid';
import validator from 'validator';
import { type WebSocket } from 'ws';
import { type AuthorizedRequest } from 'core/Auth';
import { checkValidationResult } from 'core/ErrorHandler';
import { Scenario } from 'models';
import { ProcessAction } from '../../../protocol/Actions';
import { Action, Scenario as Protocol, type IScenario } from '../../../protocol/messages.js';

const defaultPhoto = Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACAAIADASIAAhEBAxEB/8QAHAAAAgMBAQEBAAAAAAAAAAAABwgEBQYDAgkB/8QAORAAAgEDAgQEBAQEBgMBAAAAAQIDBAURAAYHEiExE0FRYQgUInEyQoGRFVJioRYjM7HB0ReS8HP/xAAbAQADAAMBAQAAAAAAAAAAAAAEBQYAAQMHAv/EAC8RAAEDAgQCCgIDAQAAAAAAAAEAAgMEEQUSITETURQiQWFxgZGxwfAyoQbR4fH/2gAMAwEAAhEDEQA/AERjjUgdOuuyxjHQa5wdhqXGhI6aJdutALwsIPTGuyQD011iUBWBQEnGD6alwwcw7AepOtB1lhaoy0ucHGr3bWz71um5QWiw2qpr6yoYJHBTxF3Yk4HQdh7nAHmdbLhJwqq+Il5liatit9pt0RqrlcZ1Pg00IPUk+bei9ye3nre7i40WbZFtr9j8GLItutcuYpLrK7NX1nkXd1xyg46KOg99AVOImN3CgGZ/6Hj/AEj6TDBK3jTuys9SfD+1Q274ejZagNxP3LbdvCIlpKBJ1qa1gD+EIhKqT5FmGtnt/h78O1dMGaxbzqo4wDOVuUKYUHq4UREnp16H9NCjbtlu246o1ddWKis2XmqCWJJ886YvYWz7HtyzS1l3ulBcEqInSOnE3I0jAdUXIyHx1AyCfLOk1ZWTN1dIb8hoPviU2p6Wm2ZELczqfvgFKtnw0/Czv+OH/D2693WKqaN1lj5oa2GNw2A5LKrFT6D99C/it8EPEjZNHVbh2pNQ7y29Apk+etRJmRQMnxKc/WpA745hq34Pblotqbxklqa8rbUlZgZC2OQnIDDIyfLqemD99ORsLiRsetvENRsndFueolYc8FNV58Q+amNvxH2Qk+2hxi1XRvsXZm96yXCaSpabDKe5fIuroTE2CP21EemB8hr6FfGD8JlDeKOu44cLqaMwVDGa8WmnUERSE4aaEL0K5/EmARknywEPq7ZJFz4UEIcNj8v3Hcaq6StjrIw9hUrU0clK/K4LOSQ8pwBrkUHpq0eDlJyNQ5YuvQaLQhCieEMcx16VASOmujp06eWvKdG7axYFLhQ4BPbVhEFJHKnL0AOPM+uuECZAGpsSZwAO+hi5OBHousURZgAO/TV1brYs86pJlyDhYU6k/c9h7+eolFGojaUH6gQsft6t9/8AvRx+H7hSdy7tpzeEMMNIrVksJ6u0CKWYsv5AfItjJ0HWVTaaJ0jjYBE0lKaiURtF7q54zXWm2HsyxcHNrP4cFLSxXS71QHhmoqZVD5YdAVXmCrnJwoxjQDglikqe7FQcs7HJx7A623G7dlw3hvS53Gslp4IWqGYRxMrDp0XqM82BgDJOPLGsLbKfxplCqQpI/YnA/wCTpPSDLAHO3Op8Sm9ac02RuzdB5LamPcNynoNvWCkjC+CtRUu8SuCz/gT6umFXr92OiRt3gPvOtgyt0pokkIYwK7cgPcFR+Ug9RjUO11FNbLgkcKKCkcSOw7khFB0ftg3+FoouYDy0sqamVtsg0TejoYnMLn6lDOk+ELiVfK2blr4IaTkDCWUHEjE9eg7647q2Z8QvBKyM+37vbpbbCf8ANRaRZwB/UsnQD3A/XTpbY3bTimRGiRsLgaibyFDeaOYS0yMjqVdCOjKe4OhJqlzWAkg9xC+oKdpkLSLd91A+GPiKnFvh/S3670EUb3FXtd+pAuYxVIuBIFP86YP3RvXSUfGXwY/8ecQ7tdLHTLFSfNIHEWeULMnPGSPJujKfJgFbvz4Zj4YoH2Zcd/7ep3IpKSqjqYF9MczD+w1J+O/bi1m37Pv6KlFTSVVMbXdoQcGSIHnQg+TI/KVPkTntkEzBasR1Baz07j2e3mUtxyjt+XL9gf8AfIL5iVkCgLKi8ocHp6Edx/8Aeuq94up6a2O57G1qrzRxyePEQJopgMeJGwBVseRx3Hkc6g2vZ9+3DBdKmy2x6mOy0TXGvYOq+DTKwUyHmIzgsOgyfbV2JGZcxOih3RPzloGqyksYHYdNRiCG6DVnNHgEY1FMeT0GvtcVLgU9Dqzgj6rqNTQjpnVnTxYYHyzoIusU/A0WxsNuFhs1LfZ0X52ud/k+deYQQo3IZgD0Ls4ZUz0HIzemme2jcF4dcArxuSkkWCsu8XyZqJBzvNK45ppHPfAUiJB2BLHHXS/10K33ae3Kq3RmR7dRigqIE6tzxvIcge4kzjvg5GeuCtuOtuScArRFXL8riqnaKF1IZkIXDEfy8wIyenf21M4o7iNaDuXWPwFSYUwMebbBtx8/fJLLWqaurLsUEYb6VUk5Pr76trGkRr4os4VWDyE+XkM+nn09NVNbUuk5WNIvEc45kJ6/YeWp1op5ijrCpdmDt06878pCj3750W/ViBYLyaLcrvOyUcj11RT3OeEuWMtPRtInU+vTOihw04wbJu9RHbaSpqoag9FSppmi5vYE9M+2lxtNs3xue7fwqlnWmiDiHwnfDtnsQCQP3/trVbs4X7/4XVhrjVwXGggkiMVfDUIVkLfk5eYtzA9/bqCR25S0jSwXI121RkFaWyFoB030Punnsu5qSiozWzzhII15mYnoAPPVEvxScMqu7Nt6mpNzV9SG5OajtDyxt64Oc4/TVA1uu+4+AlJXbNp2qbzcI1Mi9MpGFLPy57t9OAPU6AVl4ZcU6KouVxn3IlqrKON5oBJI4SZwV5YwVIbmb6h9IIGM4IONJ4KMVAfcgW5myaT1Ap3sDgbnkCU3PDu92RNxXW4UlRIaa51UNPMskTRSoXhkQB0YAqcle/tovb/27Q8QOD1dtS71AijnEcSVWM/LztgQykeaF8Kw9H0su0G3g21qSn3nSS2683alJp/HI8XxYzzxFiPP6SP18tMdwo3jQ7x22lDdqYj52n+XqVX8rHowI7ghgSp8j9tI6eXo1WDfS9r/AHwR+K0pmp8wF9ivmZv2w11ovcu3LlT+FWUESwumc4kUHoD5ggDB8+h0PayEgHlJGRg+401XxY7ZfbHFmSnvFDIKSSlhnpa5E6uoJ5nU9nGfxJ3B7YPdZ7pRyUk7RSgdgyMOquh6hh6gjXqFFNxYwTyXmFbDkebLMTIM6iNGFfoNWlQgyTjGoMi5bTEapdZWUMOFDFTj11YU4zhQNcIkdowuTgHONafZsHzNwS3yUkEsU8iK7yj8HXoQf+PPSqSTI0u5KjijzuDea13Cu07glv8ABTWOOSSqqCgePAMSqfwmUHKn1APYZPoCb/i+3ALXZbZsilnz4CIanki+iWQKO4A6YxkD+oemuPw92qkluv8AiGo+m3UIknposcvzEwBcyOfzMQPsoIA0FOOO87pe96XCsqavxFnnYN06EdOgHkAO33++pKaTpuJAW/DXzVZDD0PD3PJ/L79+hDOnpw0rTStzHu7Yxj29tXloua0dXR1ixlIUfABHXIPUn31nauqqKejFYgjP0uRCoxkjv/3016s10kuVlleem8FoKrKjqcqRkd/cHTp7S4X7EsoTG1xvum04Z7Z4d7lkSqq7fGlWGOXWRlDfcAgasuPNPbrDt2GloLfTpSo2QyRgsWIx0886XrYO/auwMZpXcRocs3kMnzOtPxT3ldd72GCG0VDn5d/Ek5T1PQjHuME6VCmmEwBPVVDPUUfCDmjrW2+UxHw918U2wbbZ3eJ35mkRWIYODn6cefTy0Xo+H+wIIDe6aCngm/H4at2b2wcEfcaTL4aeGPEW53i3XG5XS5Wix22aOvRpWAatAP8Apxg/lPmR5aMW8d8S7f4gf4WoKzxUqVD+ArZeAn1HcKfLOg6iPhyPa03vcomKSOsfHe7LWHitB8QTJUUOzqe2TOlbUNXzxyxsVeNoQnIQR/UxH6nWh4Hbhrqy6xNUxRF3h8V5o18NmPZuYD6SeZevQHOh1xa3MYOI22tmCmQJYbZSPW1Tv1+Zqy8ogVcfiKcjEk9FB6eeiVwXtUyoK1YxiqqHi5h5MOhH6kD9QdIKxrmBotyTDNC+J2U3/L3PwvPxXWK3XaSggvhklsF4ES1hjjDT2maT6Iq2LzxzJhwOjKcMB9LBCN77euW275X7Yu0arUUDHwmQlkdAOjo3mjqMj39Dkafr4t1urbR23X2YOaqkkZHVVyZUOQEx59WAI9G0n/GCrpL/AFl+qKZ0kn2/V4hkU5DUs2ElTPmEqCSP/wBW1dYJM7hs5H9HT3v6eC8zxWEXdzH7Gv8ASBdTH9R9NQ2i651ZT9Tj01GZMddVQNlLkKfTZAAz01pdv1MlJc6HwIy5SWKXl/mxnm/sT+2s9EqcgdXA645D37d9aGw5iM8hGZRCUiHmCxGf7Z/fSmY9QqogHWCajbzfwWeh2vaYvEWKxzSswGB9UOS59yzIo+x0pm/6h6i71TyZASTGT5ZHno6U/EGptuzrXuQQst0eEW6c4ypgTn5ZPuebGPbPpoO78q7fda97pCiKK1QZ41/CH78y+xPX2ORqSoI3w1LnPHdfvBN1Z4iWzUYaw8iB3W0WQnhxSwSFj4crYzjIVvXUCloLjtW4SyXSlnFFXIAHOWBAOQyn82Mn9Dq4tPNTYppQZaNmDKw6tCfcemtvTyUZpqnbW4ofFonpGqYGOOnKQQyN7gnBHtp66Ux6WuFLRts7ONwqDb1zW2NIQsVVR1kZjYEBkdT/AMjXiSx2aKYVBpan5dzkxw1MiI32CnAP2Gqe82iu2fd6mloqvxYY3GcjKujDMblfRl8+4II9NazYPE0bZr46tYVj5WBaORedPurYJX9R+utk2GZmt0XG7M8Ova3PVEjhrtjYV+njtq7L3BGzYPj1VxqjGi+fIF5M59zjRl3RXcNODttpN23m00tvttvUrR26AAVd3qB9QiDNlnJOC8jEhR1J7A42L4umj29cJJ7dJcPkaaSpjgVzynkXP1Nj6FzjJ7+nXSkbo39uzijuaTdO8rm1XWzjkjRRyw00XcQwp2RB6dz3JJJOlnRJayQmTRo313TeoxLhBobYu7LCwHf48gjlat8XbiBuWDfO4ZlNTV3atu9z8MYSJ2WMRoo/lWNFiQeg++m1+Hzd6+O1vrWzR1LEd/wuOVuYe+WOkI23eZrDFFFCkciVDBqiJx0dO4BPcHzBHUd/PTN8DL0oqxSiYpFMFqKdnPbIx1P9j9s6TY1CWjiN7NvVHYYWSsMTu0Jv+I1mpbztq52i4ylVpYfnPGjGH+XIP+ZGfysOU9vQg9GyPndxR4c3ThlNdLfXlJ6K/QgWash+qGspRIsplU9cY5FQrnIYnuME/R6iutNcLAyVzBJIIjT+Ix6Kki9m/pz1P76SbbUFRuWu3l8PW8YjzJT1VfYjI3M1svFNFlvCbyjmQMGA+luje+mOA1XUc4HqixI7d/j2Uvi9MQQwjrG4HLb590ps0bF8dPue2ohBDYI1b1EeGIPTGo9e9FKYBR0TU5jhVJiZS/iyAnLjI+nPTp7avM+tlGcPS6k0kY5oyyjA7n11o7La40qqQ18kivUuvJAnRypPRyfyj+5Ht11FW4UdRa7da5LNSQtRzM81XGD41QjMPpfywB21ZI838Ykq3YF3kZ1Plg55ce2MAe2k0r3OaRa2/wB891VQxta4Hfb/AH025IpW2ggvNDc62pUG32q2XGslTAKkQwoIlA93YH99K5d62Spq5DIAAWxyqMAfYDTR7TrY7Nw53ZXXFiIloPCClc83NKmMg9+pA98aVW5VSyVckhi5lLHAY9cf9644KwZ5ARoDa/7+UwxtxMMZvqdbeg+FOoSxUSpO6gDqyuRy/fHl79vtrW2g1F1hXb7VwIaOU0xk6mCUDmK9PyOB5dOx0P4amjiYSQ1M1LIPUc6H/ka72i/ta7zTz84WIP15T0TOQce3Xt5aZVlC0tzxb8lPU9Q4OyybLdLTS7gukVDWOY6kUiUjE9nC9Ub39M6gHa9wo7k9vnp2WWN+Qgjz1JS7tJdmbAWqiYT07DtLGQCV+/fH20c+H9ys29gP41SxR1NOsYp6tcH6j9ISQdwGOAreTEA4BzpPWcSia19rtcE2w+RlS9zDo4GywW7drrtHghuCvljC1lfFFTlsdQHkUBR+mSdL7a6nw2UMcH10zXxO1zU3Dimtsf0me5woyjp+AMf+BpbKG3mrhzH1YH++jcIh6TTOe7ck+wQ+M1JpatrRsAPcrfU0wqKgMnUNyFcewAxo98M62WjalCt/pwBRj15yT/udLrs4zyO0LL9cI6k/lHmf/vXTIcNaWNvlYo4vmKiQqvKOijHYf96ncaZw2ljuxVGCSCSz2pn490VFFwquFQ0qpP8AK+HG7nAGQVGf/ZiPtoD3Os/hXEml4iVgEb2jbiS1zY7zrTmPr6nleNPdiPfRI4uUVRaOHllpOZ5I6q5n50p0RjHCXCE+S9QP0PnpcLlvBty3Wv29UOGortTyRmU/ieqUF4JPZVkXlC+jtnuMCYFTPMJcNnXv4fbrjjU8Zm03BFvH7ZB+oRiPELLliQVB6jUJk+rJGrGVeYc4H4hnUbw2YkhSQvUn01fh/NQTouSu4qdiqxAAgnI6dc/fVtTvNDD4dK7nkJ52Ayenp6DvrxS0sksiRwqS7MAoHcnPTWxs9vttDLI9KI6mopziSaRcxrIc4WMdmAwxLHvy9AM50jnmDBqLqqghc/Y2X7UNGnDuXb9xSRJLtM7tKDlomTlePmHmCT1HfGD5aBlw2deDzVT0rUlGJTCaqUgh3ABIjH58ZGT2GRnr00wm2bLTX+W41+4LhJRbctUDXO7179WgiXp9JPeWQkIq+Zb20IeIHESl3tuFqijt5oLXTItLbbfEelLTL+FSfNzksx7lmJOu+GB3ELB4nz++gWYi5phDnHYWHPTfy7fE+mbo9kWyrXldqhyfz+Kc/sOmulw4SV0cBqLTXF3AJEM4/F7BvLWntNVSwwpUBsReZx+H7618Fzpo4Q8/4Rg84HMAPU+2qfIwtsVNAEm6BMFwq7PPBSXSGWOSmkKFX/Ei9CMeoyT++i1w13GKK6+Izh6SrjaAnPRubB5T+2R7jUPf+3LXuulKUgjhutMvPEw7SIe2D5qT09joabPudbFchaJGKTI4aNGOCXQ5K/cjOP00srqYS0zoj4hdYHOpqkSjwKOfxMiS6bHo7pD9Ziq4qhwvcAh0Y4++D+ul/sVSxfljYczDoM99NNZrVaOIG1qikrpnjcTlAz5EUgKqQocfhcEZGe/l6aA3ErhjXbEukklKjGnzz4XsB6j9e4/bSjBKxkQ6MT1gSm2OUT5QKsDqkC/d/ittpxRzy3NkT/MmiglKj8QCsfEH+x00nAy0U6XL5+dAyUcDTxxgfix+HPr66UHaN8kiqYLjAwWeDAfHZkPQnGmu4Lbopz4NfRnnaACOopfMx5z9B8x3x7ZHkNLf5RC+5kbs77ZNP4tMzh8E/kPbe/7TBU0Vl3lsis4b7nrQJ6tWY1MZBeKoZedXH9XKwbHmpYaSzeWzrzw+3dNZ75EY57cfFDr+CVOpR0PmrdMfqO4OjteZq7Z8Ne8VVK0oCVFFK+QWVTIYnJ88K5U/bB1nuOddS7o23T10sXLPFSw3OjbuFSQhKmAH+UOySAeWSR3I0JhZdTPyNN2P9+71W8RjbO0vIs5v34S1SoQoyMeWorDDasKle/U/bUDlJbGNV4KlXBbamVoHSROjKcjV/t5pCPlI4mkJlU+GvdwVKED3+rpqnp4XmyiYyqlupx0GptPf223Tz7hFOss9shkqIgxwDKFIjJx3w5U++NJJQXggbqoh6pBOyxvGbe1TAf8AxbaK0/wy31ZkuDJ9Ira1enM3qkY+lB2zzN56GPiiGqiA6BgD/fXS+zvVX6olkcs0eediclnxgn/2J1ErgWpYqlR1iOG+x0/pIRFGGjz8UkrpTJISdth3Baihun8NqVimBNJWDIx+R+x1d0V4ltrikLiWBhmIk90/l/TWOhkW5W8wE4b8SH+Vx5/rr1BXSz0Rj6+PASyj+odx+umJclkZsbLT196/h9RDVKzctK4IGe8LdGH6H/bWX37bvl7ol+tmUMjCTmXyfuD/AG/trzdrgKmgWVep5Dn7Ef8Aep8VSt0tsFNKOYSwmNs+TLgg65k5tF3LcwRQ4F8Q6WR5KSrkQx1v0VdMw6B+3MPUHvj76LW9dsUm5dvSUiATyRoRTyOc5IHRSfQj6T+/caTu3STbavkFbA5WF3Csc9uvXP26HTTbTv8Afqm1LU0tKtfByj6Vl5ZEYeRBHXzwdSuI4fwZxNEbX905osTIhMEwzN+Ett+stZtC8RowkjgqV8anft9JJBB9CCCCPUH20TOAF6rE3uLcKliK2HmQM3TnjYNj2yuRrScUNpVm+bN40VslpqikUyxPMFUA56qMd8+egzsu91W1t02+4SK8c9trEaRexwDhh/uNMpW9MpXRncj99iAo5RBOHjYG/l/xPfuC4Wrcu2YNrXReasMDPDKv445UXKgH+tRhh2PQ9xoI7vv8ktiFJMOXKsqR5z4atgBf2UfsdF3eEVsjoKPfFpRIv8gLPyf6eXGI5kXyyCQw8mTHnnS/7kWvqH+cnj5adpGij6g9V759/fUzhTA4DkPftCo8UcWk23PtpYrIVKhiemockKqylG5sgE9MYPpq0mjHU6/KCeChqfmKijiqkwV8OT3HfVNnIFxqpnICbHTvX//Z', 'base64');

const loadScenario = (id: string) => (
  Scenario
    .findById(id)
    .select('name description nodes photo')
    .lean()
    .then((scenario) => {
      if (!scenario) {
        throw notFound();
      }
      const data = Protocol.decode(scenario.nodes.buffer);
      const scenarioNode = data.nodes.find(({ id }) => id === 'scenario');
      if (!scenarioNode) {
        throw new Error("Couldn't find the scenario node");
      }
      scenarioNode.scenario!.name = scenario.name;
      scenarioNode.scenario!.description = scenario.description;
      scenarioNode.scenario!.photo = scenario.photo.buffer;
      return data;
    })
);

const saveScenario = (id: string, data: Protocol) => {
  const scenario: IScenario = Protocol.toObject(data);
  const scenarioNode = scenario.nodes!.find(({ id }) => id === 'scenario');
  if (!scenarioNode) {
    throw new Error("Couldn't find the scenario node");
  }
  const { description, name, photo } = scenarioNode.scenario!;
  delete scenarioNode.scenario!.name;
  delete scenarioNode.scenario!.description;
  delete scenarioNode.scenario!.photo;
  return Scenario
    .updateOne({ _id: id }, {
      $set: {
        name,
        description,
        nodes: Buffer.from(Protocol.encode(scenario).finish()),
        photo: Buffer.from(photo!),
      },
    })
    .exec();
};

export const create = [
  (_: AuthorizedRequest, res: Response, next: NextFunction) => {
    const scenario = new Scenario({
      name: 'New Scenario',
      description: '',
      nodes: Buffer.from(Protocol.encode(new Protocol({
        nodes: [
          {
            id: 'scenario',
            position: { x: -640, y: -150 },
            scenario: {},
          },
        ],
      })).finish()),
      photo: defaultPhoto,
    });
    scenario
      .save()
      .then(({ _id }) => (
        res.json(_id)
      ))
      .catch(next);
  },
];

export const load = [
  param('id')
    .isMongoId(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    loadScenario(req.params.id)
      .then((data) => {
        res.send(Buffer.from(Protocol.encode(data).finish()));
      })
      .catch(next);
  },
];

// @dani
// Same for this. This will desync the editor peers.
// Let's refactor it later into the WS endpoint when it's actually used in the UI.
export const remove = [
  param('id')
    .isMongoId(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    Scenario
      .deleteOne({ _id: req.params.id })
      .then(() => {
        res.status(200).end();
      })
      .catch(next);
  },
];

export const list = (_: Request, res: Response, next: NextFunction) => {
  Scenario
    .find()
    .select('name description')
    .sort({ createdAt: 1 })
    .lean()
    .then((scenarios) => (
      res.json(scenarios)
    ))
    .catch(next);
};

export const photo = [
  param('id')
    .isMongoId(),
  checkValidationResult,
  (req: Request, res: Response, next: NextFunction) => {
    Scenario
      .findById(req.params.id)
      .select('updatedAt')
      .lean()
      .then((scenario) => {
        if (!scenario) {
          throw notFound();
        }
        const lastModified = scenario.updatedAt.toUTCString();
        if (req.get('if-modified-since') === lastModified) {
          res.status(304).end();
          return;
        }
        return Scenario
          .findById(scenario._id)
          .select('-_id photo')
          .lean()
          .then((scenario) => {
            if (!scenario) {
              throw notFound();
            }
            res
              .set('Cache-Control', 'must-revalidate')
              .set('Content-Type', 'image/png')
              .set('Last-Modified', lastModified)
              .send(scenario.photo.buffer)
          });
      })
      .catch(next);
  },
];

class Editor {
  private data: Protocol = null!;
  private readonly id;
  private loading?: Promise<void>;
  private readonly peers: (WebSocket & { id: string; isAlive: boolean; })[] = [];
  private saveTimer?: NodeJS.Timeout;

  constructor(id: string) {
    this.id = id;
  }

  async addPeer(ws: WebSocket) {
    if (this.loading) {
      await this.loading;
    } else if (!this.data) {
      this.loading = loadScenario(this.id).then((data) => {
        this.data = data;
        delete this.loading;
      });
      await this.loading;
    }
    const { data, peers } = this;
    const peer = ws as unknown as typeof this.peers[0];
    peer.id = uuid();
    peer.isAlive = true;
    peer.once('close', () => {
      const index = peers.findIndex(({ id }) => (id === peer.id));
      if (index !== -1) {
        peers.splice(index, 1);
      }
    });
    peer.on('message', (buffer) => {
      if (!(buffer instanceof Buffer)) {
        return;
      }
      const action = Action.decode(new Uint8Array(buffer));
      ProcessAction(data.nodes, new Action(action));
      peers.forEach((p) => {
        if (p.id === peer.id) {
          return;
        }
        p.send(buffer);
      });
      this.debounceSave();
    });
    peer.on('pong', () => {
      peer.isAlive = true;
    });
    peers.push(peer);
    peer.send(Protocol.encode(data).finish());
  }

  ping() {
    this.peers.forEach((peer) => {
      if (peer.isAlive === false) {
        peer.terminate();
        return;
      }
      peer.isAlive = false;
      peer.ping(() => {});
    });
  }

  shutdown() {
    this.peers.forEach((peer) => peer.close());
  }

  private async save() {
    delete this.saveTimer;
    if (!this.data) {
      throw new Error('Data is not loaded');
    }
    await saveScenario(this.id, this.data);
  }

  private debounceSave() {
    if (!this.saveTimer) {
      this.saveTimer = setTimeout(() => this.save(), 1000);
    }
  }

  async forceSave() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      await this.save();
    }
  }
}

const editors = new Map<string, Editor>();
const pingInterval = setInterval(() => (
  editors.forEach((editor) => editor.ping())
), 30000);

export const shutdownEditors = async () => {
  clearInterval(pingInterval);
  editors.forEach((editor) => editor.shutdown());
};

export const saveEditors = async () => {
  for (let editor of editors.values()) {
    await editor.forceSave();
  }
};

export const editor = [
  (ws: WebSocket, req: AuthorizedRequest, next: NextFunction) => {
    if (!validator.isMongoId(req.params.id)) {
      next(badRequest());
      return;
    }
    let editor = editors.get(req.params.id);
    if (!editor) {
      editor = new Editor(req.params.id);
      editors.set(req.params.id, editor);
    }
    editor.addPeer(ws);
  },
];
