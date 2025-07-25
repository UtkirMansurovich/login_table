import type {FC, JSX} from "react";
import {useEffect, useState} from "react";
import {CiSquareMinus, CiSquarePlus} from "react-icons/ci";
import React from 'react'
import {ACCESS_TOKEN, USER_DATA} from "../../config/constants.ts";
import {MdLogout} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {useAuthStore} from "../../store/authStore.ts";

export type dataType = {
    name: string,
    material_id: number,
    color: any,
    code: string,
    last_price: number,
    min_amount: null,
    category: string,
    parent: string,
    unit: string,
    width: string,
    remind_start_amount: number,
    remind_start_sum: number,
    remind_income_amount: number,
    remind_income_sum: number,
    remind_outgo_amount: number,
    remind_outgo_sum: number,
    remind_end_amount: number,
    remind_end_sum: number,
}

type keys = "name" |
    "material_id" |
    "color" |
    "code" |
    "last_price" |
    "min_amount" |
    "category" |
    "parent" |
    "unit" |
    "width" |
    "remind_start_amount" |
    "remind_start_sum" |
    "remind_income_amount" |
    "remind_income_sum" |
    "remind_outgo_amount" |
    "remind_outgo_sum" |
    "remind_end_amount" |
    "remind_end_sum";

export const Main: FC = (): JSX.Element => {
    const navigate = useNavigate();
    const {setUserAndAuth} = useAuthStore()
    const [data, setData] = useState<{
        [key: string]: {
            [key: string]: dataType[]
        }
    }>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [collapsedParents, setCollapsedParents] = useState<string[]>([])
    const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

    const getFormattedDate = function (type: string) {
        const today = new Date();

        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        const year = (type === "to" ? today : oneWeekAgo).getFullYear();
        const month = String((type === "to" ? today : oneWeekAgo).getMonth() + 1).padStart(2, "0");
        const day = String((type === "to" ? today : oneWeekAgo).getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }

    const [date, setDate] = useState<any>({
        from: getFormattedDate("from"), to: getFormattedDate("to")
    })

    useEffect(() => {
        if (date?.from && date?.to) {
            (async () => {
                try {
                    setIsLoading(true);
                    let response = await fetch(`http://apialfa.apoint.uz/v1/reports/reports/materials?start=${date?.from}&end=${date?.to}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
                        }
                    });
                    let json = await response?.json();
                    let parentNames = new Set<string>([...json.map((j: dataType) => j?.parent)?.filter((a: string) => a)]);
                    let parents: { [k: string]: { [k: string]: dataType[] } } = {}
                    let categoryNamesAll: string[] = [];
                    parentNames?.forEach((a) => {
                        let children = json?.filter((prod: dataType) => prod?.parent === a);
                        let categoryNames = new Set<string>([...children?.map((ch: dataType) => ch?.category)?.filter((c: string) => c)]);
                        let categories: { [k: string]: dataType[] } = {}
                        categoryNames?.forEach((cn: string) => {
                            categories[cn] = children?.filter((ch: dataType) => ch?.category === cn);
                        });
                        parents[a] = categories;
                        categoryNamesAll.push(...categoryNames);
                    });
                    if (collapsedCategories.length === 0) {
                        setCollapsedCategories(categoryNamesAll);
                    }
                    if (collapsedParents?.length === 0) {
                        setCollapsedParents([...parentNames])
                    }
                    setData(parents);
                } catch (e) {
                    console.log(e);
                } finally {
                    setIsLoading(false);
                }
            })()
        } else {
            setData({})
        }
    }, [date]);

    const Logout = function () {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(USER_DATA);
        setUserAndAuth({
            isAuth: false,
            user: null
        });
        navigate("/login");
    }

    const getTotals = function (k: string | undefined, c: string | undefined, key: keys): number {
        let arr: dataType[] = [];
        if (k) {
            let kData = data?.[k];
            if (c) {
                arr = kData?.[c] ?? []
            } else {
                arr = Object.values(kData ?? {})?.flat()
            }
        } else {
            arr = (Object.values(data ?? {})?.map((obj: any) => Object.values(obj ?? {})?.flat())?.flat() as dataType[]);
        }
        let dArr = arr?.map((a: dataType) => a?.[key] ? Number(a?.[key]) : 0);
        return dArr?.length > 0 ? dArr?.length === 1 ? dArr?.[0] : dArr?.reduce((a: number, b: number) => a + b) : 0
    }

    return (
        <div className="container" style={{alignItems: "start"}}>
            <div className="table-body">
                <div className="input-container">
                    <div className="input-box-table">
                        <label htmlFor="startDate" className="label-text" style={{fontSize: "16px"}}>Дата
                            начала</label>
                        <input className="input-table" name="startDate" onChange={(e) => {
                            let val = e?.target?.value;
                            if (val) {
                                setDate({
                                    ...date,
                                    from: val
                                })
                            }
                        }} type="date" value={date?.from}/>
                    </div>
                    <div className="input-box-table">
                        <label htmlFor="endDate" className="label-text" style={{fontSize: "16px"}}>Дата
                            окончания</label>
                        <input className="input-table" onChange={(e) => {
                            let val = e?.target?.value;
                            if (val) {
                                setDate({
                                    ...date,
                                    to: val
                                })
                            }
                        }} type="date" value={date?.to}/>
                    </div>
                    <div className="logout-box" onClick={Logout}>
                        <MdLogout size={22} className="logout-icon"/>
                    </div>
                </div>
                <div className="table-container">
                    {isLoading && <div className="linear-loading"></div>}
                    <table className="table-box">
                        <thead style={{position: "sticky", top: "0", backgroundColor: "white"}}>
                        <tr>
                            <th rowSpan={2} className="table-th bg-gray-100">Наименование</th>
                            <th rowSpan={2} className="table-th bg-gray-100">Цвет</th>
                            <th rowSpan={2} className="table-th bg-gray-100">Ед изм</th>
                            <th rowSpan={2} className="table-th bg-gray-100">Артикул</th>
                            <th rowSpan={2} className="table-th bg-gray-100">Цена учетная</th>
                            <th colSpan={2} className="table-th bg-green-100">Сальдо начало пероида</th>
                            <th colSpan={2} className="table-th bg-blue-100">Приход</th>
                            <th colSpan={2} className="table-th bg-red-100">Расход</th>
                            <th colSpan={2} className="table-th bg-yellow-100">Сальдо на конец периода</th>
                        </tr>
                        <tr>
                            <th className="table-th bg-green-100">Кол-во</th>
                            <th className="table-th bg-green-100">Сумма</th>
                            <th className="table-th bg-blue-100">Кол-во</th>
                            <th className="table-th bg-blue-100">Сумма</th>
                            <th className="table-th bg-red-100">Кол-во</th>
                            <th className="table-th bg-red-100">Сумма</th>
                            <th className="table-th bg-yellow-100">Кол-во</th>
                            <th className="table-th bg-yellow-100">Сумма</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="bg-gray-50">
                            <td className="table-td pl-md td-bold">Итог</td>
                            <td className="table-td text-center td-bold"></td>
                            <td className="table-td text-center td-bold"></td>
                            <td className="table-td text-center td-bold"></td>
                            <td className="table-td text-center td-bold"></td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_start_amount")}</td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_start_sum")}</td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_income_amount")}</td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_income_sum")}</td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_outgo_amount")}</td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_outgo_sum")}</td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_end_amount")}</td>
                            <td className="table-td text-center td-bold">{getTotals(undefined, undefined, "remind_end_sum")}</td>
                        </tr>
                        </tbody>
                        {(Object.entries(data ?? {}))?.map(([k, v]: any, index: number) =>
                            <tbody key={index}>
                            <tr>
                                <td className="table-td pl-md td-bold cursor-pointer"
                                    onClick={() => setCollapsedParents((collapsedParents?.includes(k) ? collapsedParents?.filter(pn => pn !== k) : [...collapsedParents, k]) as any)}>
                                    <p className="m-0 td-text">
                                        {!collapsedParents?.includes(k) ? <CiSquareMinus size={20}/> :
                                            <CiSquarePlus size={20}/>}
                                        <span className="mt-2">{k}</span>
                                    </p>
                                </td>
                                <td className="table-td text-center td-bold"></td>
                                <td className="table-td text-center td-bold"></td>
                                <td className="table-td text-center td-bold"></td>
                                <td className="table-td text-center td-bold"></td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_start_amount")}</td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_start_sum")}</td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_income_amount")}</td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_income_sum")}</td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_outgo_amount")}</td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_outgo_sum")}</td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_end_amount")}</td>
                                <td className="table-td text-center td-bold">{getTotals(k, undefined, "remind_end_sum")}</td>
                            </tr>
                            {
                                collapsedParents?.includes(k) ? "" : Object.entries(v ?? {})?.map(([c, items]: any, index) =>
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className="table-td pl-lg td-bold cursor-pointer"
                                                onClick={() => setCollapsedCategories((collapsedCategories?.includes(c) ? collapsedCategories?.filter(pn => pn !== c) : [...collapsedCategories, c]) as any)}>
                                                <p className="m-0 td-text">
                                                    {!collapsedCategories?.includes(c) ?
                                                        <CiSquareMinus size={20}/> :
                                                        <CiSquarePlus size={20}/>}
                                                    <span className="mt-2">{c}</span>
                                                </p>
                                            </td>
                                            <td className="table-td text-center td-bold"></td>
                                            <td className="table-td text-center td-bold"></td>
                                            <td className="table-td text-center td-bold"></td>
                                            <td className="table-td text-center td-bold"></td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_start_amount")}</td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_start_sum")}</td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_income_amount")}</td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_income_sum")}</td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_outgo_amount")}</td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_outgo_sum")}</td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_end_amount")}</td>
                                            <td className="table-td text-center td-bold">{getTotals(k, c, "remind_end_sum")}</td>
                                        </tr>
                                        {
                                            collapsedCategories?.includes(c) ? "" : items?.map((itm: dataType, index: number) =>
                                                <tr
                                                    key={index}>
                                                    <td className="table-td pl-lgx cursor-pointer">
                                                        <p className="m-0 td-text fs-15">
                                                            {index + 1}.
                                                            <span className="text-blue-500">{itm?.name}</span>
                                                        </p>
                                                    </td>
                                                    <td className="table-td text-center">{itm?.color?.name}</td>
                                                    <td className="table-td text-center">{itm?.unit}</td>
                                                    <td className="table-td text-center"></td>
                                                    <td className="table-td text-center">{itm?.last_price?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_start_amount?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_start_sum?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_income_amount?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_income_sum?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_outgo_amount?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_outgo_sum?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_end_amount?.toLocaleString?.("fr-Ca")}</td>
                                                    <td className="table-td text-center">{itm?.remind_end_sum?.toLocaleString?.("fr-Ca")}</td>
                                                </tr>)
                                        }
                                    </React.Fragment>)
                            }
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div>
    )
}