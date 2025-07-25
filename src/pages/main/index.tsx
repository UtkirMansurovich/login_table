import type {FC, JSX} from "react";
import {useEffect, useState} from "react";
import {CiSquareMinus, CiSquarePlus} from "react-icons/ci";
import React from 'react'
import {ACCESS_TOKEN} from "../../config/constants.ts";

export const Main: FC = (): JSX.Element => {
    const [data, setData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [collapsedParents, setCollapsedParents] = useState<string[]>([])
    const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
    const [date, setDate] = useState<any>({
        from: null, to: null
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
                    let parentNames = new Set([...json.map(j => j?.parent)?.filter(a => a)]);
                    let parents = {}
                    let categoryNamesAll = [];
                    parentNames?.forEach((a) => {
                        let children = json?.filter(prod => prod?.parent === a);
                        let categoryNames = new Set([...children?.map(ch => ch?.category)?.filter(c => c)]);
                        let categories = {}
                        categoryNames?.forEach((cn) => {
                            categories[cn] = children?.filter(ch => ch?.category === cn);
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
    }, [date])

    return (
        <div className="container" style={{alignItems: "start"}}>
            <div className="table-container">
                <div>
                    Start date:
                    <input onChange={(e) => {
                        let val = e?.target?.value;
                        if (val) {
                            setDate({
                                ...date,
                                from: val
                            })
                        }
                    }} type="date"/>
                    End date:
                    <input onChange={(e) => {
                        let val = e?.target?.value;
                        if (val) {
                            setDate({
                                ...date,
                                to: val
                            })
                        }
                    }} type="date"/>
                </div>
                <table className="table-box">
                    <thead style={{position: "sticky", top: "0", backgroundColor: "white"}}>
                    <tr>
                        <th rowSpan={2} className="table-th">Nomi</th>
                        <th rowSpan={2} className="table-th">Rangi</th>
                        <th rowSpan={2} className="table-th">Birligi</th>
                        <th rowSpan={2} className="table-th">Article</th>
                        <th rowSpan={2} className="table-th">Summa</th>
                        <th colSpan={2} className="table-th">Davr boshiga qoldiq</th>
                        <th colSpan={2} className="table-th">Kirim</th>
                        <th colSpan={2} className="table-th">Chiqim</th>
                        <th colSpan={2} className="table-th">Davr oxiriga qoldiq</th>
                    </tr>
                    <tr>
                        <th className="table-th">Soni</th>
                        <th className="table-th">Summa</th>
                        <th className="table-th">Soni</th>
                        <th className="table-th">Summa</th>
                        <th className="table-th">Soni</th>
                        <th className="table-th">Summa</th>
                        <th className="table-th">Soni</th>
                        <th className="table-th">Summa</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="table-td pl-md td-bold">Итого</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                        <td className="table-td text-center td-bold">0.00</td>
                    </tr>
                    </tbody>
                    {(Object.entries(data ?? {}))?.map(([k, v]: any, index: number) =>
                        <tbody>
                        <tr key={index}>
                            <td className="table-td pl-md td-bold cursor-pointer"
                                onClick={() => setCollapsedParents((collapsedParents?.includes(k) ? collapsedParents?.filter(pn => pn !== k) : [...collapsedParents, k]) as any)}>
                                <p className="m-0 td-text">
                                    {!collapsedParents?.includes(k) ? <CiSquareMinus size={20}/> :
                                        <CiSquarePlus size={20}/>}
                                    <span className="mt-2">{k}</span>
                                </p>
                            </td>
                            <td className="table-td text-center"></td>
                            <td className="table-td text-center"></td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                            <td className="table-td text-center">0.00</td>
                        </tr>
                        {
                            collapsedParents?.includes(k) ? "" : Object.entries(v ?? {})?.map(([c, items], index) =>
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="table-td pl-lg td-bold cursor-pointer"
                                            onClick={() => setCollapsedCategories((collapsedCategories?.includes(c) ? collapsedCategories?.filter(pn => pn !== c) : [...collapsedCategories, c]) as any)}>
                                            <p className="m-0 td-text">
                                                {!collapsedCategories?.includes(c) ? <CiSquareMinus size={20}/> :
                                                    <CiSquarePlus size={20}/>}
                                                <span className="mt-2">{c}</span>
                                            </p>
                                        </td>
                                        <td className="table-td text-center"></td>
                                        <td className="table-td text-center"></td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                        <td className="table-td text-center">0.00</td>
                                    </tr>
                                    {
                                        collapsedCategories?.includes(c) ? "" : items?.map((itm, index) => <tr
                                            key={index}>
                                            <td className="table-td pl-lgx cursor-pointer">
                                                <p className="m-0 td-text fs-15">
                                                    {index + 1}.
                                                    <span className="text-blue-500">{itm?.name}</span>
                                                </p>
                                            </td>
                                            <td className="table-td text-center">{itm?.color?.name}</td>
                                            <td className="table-td text-center">{itm?.unit}</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">{itm?.last_price}</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">0.00</td>
                                            <td className="table-td text-center">0.00</td>
                                        </tr>)
                                    }
                                </React.Fragment>)
                        }
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    )
}